/// <reference path="../typings/index.d.ts" />
/// <reference path="../index.d.ts" />
/// <reference path="./database.ts" />

import joi  = require('joi');
import nano = require('nano');
import Q    = require('q');

import { Db } from './database';

interface CouchDocument {
	_id?:  string;
	_rev?: string;
	type:  string;
}

export default class ActiveCouch implements CouchDocument {
	_id:     string;
	_rev:    string;
	type:    string;
	schema:  string;
	doc:     CouchDocument;

 	constructor(e: CouchDocument) {
 		this._id  = e._id  || undefined;
 		this._rev = e._rev || undefined;

 		this.doc = e;
 	}

 	save():Q.Promise<Object|joi.ValidationError> {
 		let q = Q.defer();
 		let isValid = this.isValid();

 		if(!isValid) {
 			q.reject(isValid);
 		} else {
 			Db.insert(this.doc, {}, (error, result) => {
	 			if (error) q.reject(error);
	 			else q.resolve(result);
	 		});
 		}

 		return q.promise;
 	}

 	delete():Q.Promise<Object|Error> {
 		let q = Q.defer();

 		if(!this._id) {
 			q.reject(new Error('This document has not yet been saved, thus can not be deleted'));
 		} else if(!this._rev) {
 			q.reject(new Error('This document does not have a revision, thus can not be deleted'));
 		} else {
 			Db.destroy(this._id, this._rev, (error, result) => {
 				if (error) q.reject(error);
 				else q.resolve(result);
 			});
 		}

 		return q.promise;
 	}

 	isValid():Boolean | joi.ValidationError {
 		if(!this.schema) return false;
 		if(!this.doc) return false;

 		joi.validate(this.doc, this.schema, (error, validatedObj) => {
 			if(error) return error;
 			else return true;
 		});
 	}
}