/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "b218b6ad4843539a84b6";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var proton_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! proton-native */ "proton-native");
/* harmony import */ var proton_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(proton_native__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/tools */ "./components/tools.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


 // import the proton-native components

var axios = __webpack_require__(/*! axios */ "axios");



var cardData = __webpack_require__(/*! ./components/card_data.json */ "./components/card_data.json");

var MainApp = function MainApp(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      deckActive = _useState2[0],
      setDeckActive = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState4 = _slicedToArray(_useState3, 2),
      errState = _useState4[0],
      setErrorState = _useState4[1]; // Maps CardID to CardCode


  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState6 = _slicedToArray(_useState5, 2),
      handHistory = _useState6[0],
      setHandHistory = _useState6[1]; // Maps CardID to current count of cards in deck


  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      _useState8 = _slicedToArray(_useState7, 2),
      currDeckList = _useState8[0],
      setCurrDeckList = _useState8[1]; // Server polling circuit


  Object(_components_tools__WEBPACK_IMPORTED_MODULE_2__["useInterval"])(function () {
    if (!deckActive) {
      getInitialState();
    } else {
      updateDeckState();
    }
  }, 1100); // Setting initial deck state if a new deck deck is detected

  var getInitialState = function getInitialState() {
    axios.get('http://127.0.0.1:21337/static-decklist').then(function (response) {
      if (response.data.DeckCode != null && !Object(_components_tools__WEBPACK_IMPORTED_MODULE_2__["isEmpty"])(response.data.CardsInDeck)) {
        var initialDeckList = []; // Getting relevant response data

        for (var cardCode in response.data.CardsInDeck) {
          initialDeckList.push({
            name: cardData[cardCode].name,
            cost: cardData[cardCode].cost,
            count: response.data.CardsInDeck[cardCode],
            key: cardCode
          });
        } // Sorting data


        initialDeckList.sort(function (a, b) {
          return a.cost - b.cost || a.name - b.name;
        });
        setCurrDeckList(initialDeckList);
        setDeckActive(true);
      } else {
        console.log("Waiting for game");
      }
    })["catch"](function (error) {
      console.log("LOR window is not active");
    });
  };
  /*
  Parsing rectangle API for the data:
   Get current hand state:
    - compare to previous hand state and get difference
    - subtract from deck if new on board
  */


  var updateDeckState = function updateDeckState() {
    axios.get('http://127.0.0.1:21337/positional-rectangles').then(function (response) {
      if (response.data.GameState == "Menus") {
        //cleanup
        setDeckActive(false);
        setHandHistory({});
        setCurrDeckList([]);
      } else {
        var height = response.data.Screen.ScreenHeight;
        var width = response.data.Screen.ScreenWidth;
        var newCards = {}; //Iterate over rectangles and collect new cards not found in handhistory
        // Map the unique { cardID : cardCode }

        response.data.Rectangles.forEach(function (item, index) {
          if (item.LocalPlayer && item.CardCode != "face" && item.TopLeftY <= 0.5 * height && !(item.CardID in handHistory)) {
            newCards[item.CardID] = item.CardCode;
          }
        }); // If there are new cards this update

        if (!Object(_components_tools__WEBPACK_IMPORTED_MODULE_2__["isEmpty"])(newCards)) {
          var newDeckState = _toConsumableArray(currDeckList);

          var newHandHistory = Object.assign({}, handHistory); // For each new card, subtract 1 count from the deck state
          // and update the hand history

          for (var key in newCards) {
            for (var i = 0; i < newDeckState.length; i++) {
              if (newCards[key] == newDeckState[i].key) {
                newDeckState[i].count = newDeckState[i].count - 1;
              }
            }

            newHandHistory[key] = newCards[key];
          }

          setHandHistory(newHandHistory);
          setCurrDeckList(newDeckState);
        }
      }
    })["catch"](function (error) {
      console.log(error);
    });
  };
  /*
    Main display function for the card data and current counts
  */


  var textStyle = {
    fontSize: 18,
    margin: 7
  };
  var displayList = currDeckList.map(function (card) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      key: card.key,
      style: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid black"
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      style: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        border: null
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
      style: textStyle
    }, card.cost), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
      style: textStyle
    }, card.name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      style: {
        border: null
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
      style: textStyle
    }, "x" + card.count)));
  }); // Main render window

  return deckActive ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      flex: 1,
      flexDirection: "column"
    }
  }, displayList) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
    style: textStyle
  }, " Waiting for active game ");
};

var Example = function Example() {
  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    width: 270,
    height: 590
  }),
      _useState10 = _slicedToArray(_useState9, 2),
      windowSize = _useState10[0],
      setWindowSize = _useState10[1];

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["App"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Window"], {
    style: windowSize,
    onResize: function onResize(size) {
      return setWindowSize({
        width: size.w,
        height: size.h
      });
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MainApp, {
    windowSize: windowSize
  })));
};

/* harmony default export */ __webpack_exports__["default"] = (Example);

/***/ }),

/***/ "./components/card_data.json":
/*!***********************************!*\
  !*** ./components/card_data.json ***!
  \***********************************/
/*! exports provided: 01IO012T2, 01NX020T3, 01DE031, 01IO048T1, 01PZ040T3, 01FR024T2, 01PZ008T2, 01DE022, 01IO015T1, 01PZ056, 01IO020, 01FR039T1, 01PZ013, 01DE019, 01NX004, 01PZ007, 01PZ056T10, 01SI038, 01DE042T1, 01PZ018, 01IO045, 01IO008, 01NX048, 01FR006, 01IO022, 01FR022, 01FR042, 01SI049, 01SI053T1, 01FR009, 01SI057, 01DE010, 01SI023, 01PZ019, 01NX038, 01IO040, 01FR018, 01DE020, 01DE034, 01DE002, 01NX023, 01IO041T1, 01DE012T1, 01DE017, 01PZ040, 01NX013, 01DE045, 01PZ025, 01DE052, 01PZ040T2, 01SI053, 01DE021, 01PZ048T1, 01NX046T1, 01NX047, 01SI010, 01NX040, 01SI042T1, 01PZ032, 01IO009T2, 01SI027T1, 01IO014, 01NX038T2, 01DE022T2, 01PZ028, 01DE025, 01FR036, 01IO005, 01FR045, 01IO044, 01FR008T1, 01FR055, 01FR038T3, 01NX046, 01PZ050, 01PZ056T6, 01IO023, 01SI048, 01PZ054T1, 01PZ030T1, 01NX025, 01NX055, 01DE007, 01PZ017, 01PZ038, 01PZ056T7, 01SI018, 01PZ008T1, 01SI030T2, 01FR029, 01SI035T1, 01SI030, 01IO029, 01PZ036T1, 01FR035, 01IO003, 01PZ035, 01PZ030, 01IO047, 01PZ048, 01FR012, 01NX020T2, 01NX030, 01FR028, 01PZ010, 01NX007, 01PZ045, 01IO026, 01PZ013T1, 01PZ002, 01SI002, 01SI005, 01FR038, 01DE055, 01PZ004, 01DE048, 01IO024, 01SI053T2, 01DE001, 01PZ020, 01NX021, 01FR020, 01PZ046, 01IO028, 01FR014, 01SI037, 01NX009, 01IO057, 01IO028T2, 01PZ054, 01NX020, 01PZ052, 01FR024T1, 01DE043, 01PZ036, 01IO028T1, 01SI048T1, 01PZ015, 01NX053, 01PZ005, 01NX038T1, 01SI052, 01DE022T1, 01DE049, 01DE012T2, 01SI033, 01PZ021, 01SI003, 01SI041, 01NX040T1, 01FR049, 01IO032T1, 01DE053, 01SI045, 01FR037, 01SI036, 01FR009T1, 01IO013, 01PZ031, 01SI024, 01SI051, 01FR026, 01NX054, 01NX006T2, 01PZ059, 01NX029, 01FR030, 01NX014, 01SI012, 01SI052T2, 01PZ001, 01NX042T2, 01FR013, 01PZ057, 01SI031, 01SI034, 01SI043, 01IO018, 01PZ056T3, 01FR019, 01DE033, 01SI009, 01PZ027, 01DE045T1, 01FR041, 01NX051, 01FR025, 01DE042T2, 01NX012, 01DE024, 01SI007T1, 01DE056, 01NX043, 01DE030, 01IO056T1, 01SI030T1, 01NX037, 01NX002, 01IO016, 01SI056, 01NX010, 01NX017, 01DE004, 01SI001, 01DE011, 01IO036, 01PZ055, 01PZ008, 01PZ056T2, 01PZ014, 01DE047, 01NX003, 01NX011, 01DE046, 01FR054, 01DE050, 01FR021T1, 01FR043, 01FR049T1, 01FR033, 01SI019, 01DE042T3, 01IO033, 01NX039, 01FR011, 01PZ034, 01FR004, 01FR050, 01PZ014T1, 01NX041, 01FR039T2, 01FR038T2, 01PZ060, 01IO015, 01IO001, 01DE016, 01IO010, 01IO012, 01FR052T1, 01DE040, 01NX036, 01NX044, 01DE036, 01SI011, 01IO009T3, 01SI042T2, 01DE037, 01PZ056T5, 01SI027, 01PZ003, 01IO021, 01FR016, 01NX005, 01PZ040T1, 01FR005, 01DE014, 01DE013, 01IO009, 01NX042T1, 01NX016, 01FR009T2, 01SI014, 01NX027, 01IO027, 01SI007, 01SI022, 01IO032, 01NX015, 01SI054, 01PZ044, 01FR008, 01IO041, 01SI006, 01DE015, 01PZ029, 01NX050, 01PZ056T1, 01IO031, 01DE003, 01FR023, 01PZ033, 01SI033T1, 01PZ051, 01SI028, 01SI025, 01IO015T2, 01IO011, 01IO009T1, 01IO002, 01IO007T1, 01FR047, 01IO033T1, 01IO017, 01FR056, 01NX056, 01PZ022, 01PZ044T2, 01SI046, 01PZ033T1, 01NX033, 01DE032, 01NX006T1, 01PZ023, 01PZ056T4, 01FR039, 01FR027, 01SI050, 01FR057, 01PZ024, 01SI016, 01IO042, 01FR038T1, 01FR021, 01IO006, 01NX052, 01IO050, 01DE026, 01NX042, 01SI021, 01FR048, 01PZ049, 01IO048, 01FR017, 01IO004, 01SI032, 01PZ006, 01IO007, 01FR024T3, 01SI058, 01PZ053, 01IO053, 01FR046, 01NX045, 01DE027, 01SI044, 01FR040, 01IO049, 01NX031, 01PZ012, 01FR031, 01DE006, 01FR036T1, 01FR053, 01IO052T1, 01SI039, 01PZ039, 01PZ056T9, 01DE038, 01FR010, 01IO052, 01IO030, 01DE041, 01NX006, 01PZ016, 01PZ036T2, 01DE035, 01NX008, 01IO019, 01DE018, 01IO054, 01SI020, 01FR001, 01PZ058, 01SI042, 01DE009, 01SI029, 01PZ009, 01IO032T2, 01SI035, 01FR024, 01NX034, 01PZ042, 01DE042, 01DE045T2, 01NX035, 01FR024T5, 01NX026, 01SI004, 01IO046, 01DE039, 01NX006T3, 01FR043T1, 01DE029, 01IO037, 01PZ056T8, 01FR024T4, 01PZ026, 01NX019, 01DE028, 01IO043, 01PZ043, 01FR032, 01IO038, 01FR052, 01FR051, 01NX022, 01PZ047, 01SI026, 01IO012T1, 01DE054, 01IO041T2, 01IO039, 01NX032, 01DE023, 01NX024, 01SI040, 01FR034, 01DE051, 01IO056, 01IO055, 01DE044, 01SI015, 01SI052T1, 01NX049, 01FR007, 01DE012, 01NX020T1, 01FR003, 01SI055, 01SI047, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"01IO012T2\":{\"name\":\"Discipline of Fortitude\",\"cost\":3},\"01NX020T3\":{\"name\":\"Draven\",\"cost\":3},\"01DE031\":{\"name\":\"Dawnspeakers\",\"cost\":3},\"01IO048T1\":{\"name\":\"Yusari the Slayer\",\"cost\":3},\"01PZ040T3\":{\"name\":\"Jinx's Get Excited!\",\"cost\":3},\"01FR024T2\":{\"name\":\"Glacial Storm\",\"cost\":0},\"01PZ008T2\":{\"name\":\"Teemo\",\"cost\":1},\"01DE022\":{\"name\":\"Lucian\",\"cost\":2},\"01IO015T1\":{\"name\":\"Yasuo\",\"cost\":4},\"01PZ056\":{\"name\":\"Heimerdinger\",\"cost\":5},\"01IO020\":{\"name\":\"Keeper of Masks\",\"cost\":2},\"01FR039T1\":{\"name\":\"Tryndamere's Battle Fury\",\"cost\":8},\"01PZ013\":{\"name\":\"Augmented Experimenter\",\"cost\":6},\"01DE019\":{\"name\":\"Mobilize\",\"cost\":3},\"01NX004\":{\"name\":\"Culling Strike\",\"cost\":3},\"01PZ007\":{\"name\":\"Parade Electrorig\",\"cost\":3},\"01PZ056T10\":{\"name\":\"Heimerdinger\",\"cost\":5},\"01SI038\":{\"name\":\"Phantom Prankster\",\"cost\":3},\"01DE042T1\":{\"name\":\"Lux's Prismatic Barrier\",\"cost\":3},\"01PZ018\":{\"name\":\"Academy Prodigy\",\"cost\":2},\"01IO045\":{\"name\":\"Herald of Spring\",\"cost\":2},\"01IO008\":{\"name\":\"Fae Bladetwirler\",\"cost\":2},\"01NX048\":{\"name\":\"Crimson Curator\",\"cost\":3},\"01FR006\":{\"name\":\"Iceborn Legacy\",\"cost\":5},\"01IO022\":{\"name\":\"Ghost\",\"cost\":1},\"01FR022\":{\"name\":\"Omen Hawk\",\"cost\":1},\"01FR042\":{\"name\":\"Harsh Winds\",\"cost\":6},\"01SI049\":{\"name\":\"Glimpse Beyond\",\"cost\":2},\"01SI053T1\":{\"name\":\"Elise's Crawling Sensation\",\"cost\":1},\"01FR009\":{\"name\":\"Braum\",\"cost\":3},\"01SI057\":{\"name\":\"Ancient Crocolith\",\"cost\":4},\"01DE010\":{\"name\":\"Swiftwing Lancer\",\"cost\":5},\"01SI023\":{\"name\":\"Soul Shepherd\",\"cost\":2},\"01PZ019\":{\"name\":\"Eager Apprentice\",\"cost\":2},\"01NX038\":{\"name\":\"Darius\",\"cost\":6},\"01IO040\":{\"name\":\"Kinkou Lifeblade\",\"cost\":4},\"01FR018\":{\"name\":\"Rimefang Wolf\",\"cost\":3},\"01DE020\":{\"name\":\"Vanguard Defender\",\"cost\":2},\"01DE034\":{\"name\":\"Battlesmith\",\"cost\":2},\"01DE002\":{\"name\":\"Tianna Crownguard\",\"cost\":8},\"01NX023\":{\"name\":\"Arachnoid Host\",\"cost\":5},\"01IO041T1\":{\"name\":\"Karma\",\"cost\":5},\"01DE012T1\":{\"name\":\"Garen\",\"cost\":5},\"01DE017\":{\"name\":\"Stand Alone\",\"cost\":3},\"01PZ040\":{\"name\":\"Jinx\",\"cost\":4},\"01NX013\":{\"name\":\"Decisive Maneuver\",\"cost\":5},\"01DE045\":{\"name\":\"Fiora\",\"cost\":3},\"01PZ025\":{\"name\":\"Puffcap Peddler\",\"cost\":3},\"01DE052\":{\"name\":\"Brightsteel Formation\",\"cost\":9},\"01PZ040T2\":{\"name\":\"Super Mega Death Rocket!\",\"cost\":2},\"01SI053\":{\"name\":\"Elise\",\"cost\":2},\"01DE021\":{\"name\":\"Relentless Pursuit\",\"cost\":3},\"01PZ048T1\":{\"name\":\"Magnum Opus\",\"cost\":0},\"01NX046T1\":{\"name\":\"Paralyzing Bite\",\"cost\":0},\"01NX047\":{\"name\":\"Transfusion\",\"cost\":2},\"01SI010\":{\"name\":\"Onslaught of Shadows\",\"cost\":2},\"01NX040\":{\"name\":\"Legion Saboteur\",\"cost\":1},\"01SI042T1\":{\"name\":\"Hecarim\",\"cost\":6},\"01PZ032\":{\"name\":\"Scrap Scuttler\",\"cost\":1},\"01IO009T2\":{\"name\":\"Zed\",\"cost\":3},\"01SI027T1\":{\"name\":\"Vilemaw\",\"cost\":3},\"01IO014\":{\"name\":\"Greenglade Elder\",\"cost\":3},\"01NX038T2\":{\"name\":\"Darius\",\"cost\":6},\"01DE022T2\":{\"name\":\"Lucian's Relentless Pursuit\",\"cost\":3},\"01PZ028\":{\"name\":\"Jury-Rig\",\"cost\":1},\"01DE025\":{\"name\":\"Detain\",\"cost\":5},\"01FR036\":{\"name\":\"Avarosan Marksman\",\"cost\":3},\"01IO005\":{\"name\":\"Nimble Poro\",\"cost\":1},\"01FR045\":{\"name\":\"Scarthane Steffen\",\"cost\":3},\"01IO044\":{\"name\":\"Navori Conspirator\",\"cost\":2},\"01FR008T1\":{\"name\":\"Jubilant Poro\",\"cost\":1},\"01FR055\":{\"name\":\"Shatter\",\"cost\":2},\"01FR038T3\":{\"name\":\"Crystal Arrow\",\"cost\":2},\"01NX046\":{\"name\":\"Arachnoid Sentry\",\"cost\":3},\"01PZ050\":{\"name\":\"Rising Spell Force\",\"cost\":3},\"01PZ056T6\":{\"name\":\"Mk3: Floor-B-Gone\",\"cost\":3},\"01IO023\":{\"name\":\"Jeweled Protector\",\"cost\":5},\"01SI048\":{\"name\":\"Cursed Keeper\",\"cost\":2},\"01PZ054T1\":{\"name\":\"Undermine\",\"cost\":0},\"01PZ030T1\":{\"name\":\"Impersonate\",\"cost\":0},\"01NX025\":{\"name\":\"Brothers' Bond\",\"cost\":2},\"01NX055\":{\"name\":\"House Spider\",\"cost\":2},\"01DE007\":{\"name\":\"Judgment\",\"cost\":8},\"01PZ017\":{\"name\":\"Used Cask Salesman\",\"cost\":3},\"01PZ038\":{\"name\":\"Sump Dredger\",\"cost\":2},\"01PZ056T7\":{\"name\":\"Mk2: Evolution Turret\",\"cost\":2},\"01SI018\":{\"name\":\"Scribe of Sorrows\",\"cost\":3},\"01PZ008T1\":{\"name\":\"Teemo's Mushroom Cloud\",\"cost\":1},\"01SI030T2\":{\"name\":\"Kalista\",\"cost\":3},\"01FR029\":{\"name\":\"Entreat\",\"cost\":2},\"01SI035T1\":{\"name\":\"Night Harvest\",\"cost\":0},\"01SI030\":{\"name\":\"Kalista\",\"cost\":3},\"01IO029\":{\"name\":\"Sown Seeds\",\"cost\":2},\"01PZ036T1\":{\"name\":\"Ezreal\",\"cost\":3},\"01FR035\":{\"name\":\"Unscarred Reaver\",\"cost\":1},\"01IO003\":{\"name\":\"Death Mark\",\"cost\":3},\"01PZ035\":{\"name\":\"Jae Medarda\",\"cost\":8},\"01PZ030\":{\"name\":\"Shady Character\",\"cost\":4},\"01IO047\":{\"name\":\"Shadow Flare\",\"cost\":6},\"01PZ048\":{\"name\":\"Corina Veraza\",\"cost\":9},\"01FR012\":{\"name\":\"Catalyst of Aeons\",\"cost\":5},\"01NX020T2\":{\"name\":\"Draven's Whirling Death\",\"cost\":3},\"01NX030\":{\"name\":\"Crimson Disciple\",\"cost\":2},\"01FR028\":{\"name\":\"Enraged Yeti\",\"cost\":1},\"01PZ010\":{\"name\":\"Mushroom Cloud\",\"cost\":1},\"01NX007\":{\"name\":\"Arena Battlecaster\",\"cost\":2},\"01PZ045\":{\"name\":\"Zaunite Urchin\",\"cost\":1},\"01IO026\":{\"name\":\"Inspiring Mentor\",\"cost\":1},\"01PZ013T1\":{\"name\":\"Reckless Research\",\"cost\":0},\"01PZ002\":{\"name\":\"Back Alley Barkeep\",\"cost\":4},\"01SI002\":{\"name\":\"Spiderling\",\"cost\":1},\"01SI005\":{\"name\":\"Scuttlegeist\",\"cost\":10},\"01FR038\":{\"name\":\"Ashe\",\"cost\":4},\"01DE055\":{\"name\":\"Laurent Duelist\",\"cost\":3},\"01PZ004\":{\"name\":\"Trueshot Barrage\",\"cost\":7},\"01DE048\":{\"name\":\"Mageseeker Inciter\",\"cost\":4},\"01IO024\":{\"name\":\"Dawn and Dusk\",\"cost\":6},\"01SI053T2\":{\"name\":\"Spider Queen Elise\",\"cost\":2},\"01DE001\":{\"name\":\"Vanguard Bannerman\",\"cost\":4},\"01PZ020\":{\"name\":\"Daring Poro\",\"cost\":1},\"01NX021\":{\"name\":\"Legion Marauder\",\"cost\":3},\"01FR020\":{\"name\":\"Avalanche\",\"cost\":4},\"01PZ046\":{\"name\":\"Counterfeit Copies\",\"cost\":1},\"01IO028\":{\"name\":\"Scaled Snapper\",\"cost\":3},\"01FR014\":{\"name\":\"Yeti Yearling\",\"cost\":1},\"01SI037\":{\"name\":\"Sinister Poro\",\"cost\":1},\"01NX009\":{\"name\":\"Crowd Favorite\",\"cost\":4},\"01IO057\":{\"name\":\"Shadow Assassin\",\"cost\":3},\"01IO028T2\":{\"name\":\"Scaled Snapper\",\"cost\":3},\"01PZ054\":{\"name\":\"Boomcrew Rookie\",\"cost\":2},\"01NX020\":{\"name\":\"Draven\",\"cost\":3},\"01PZ052\":{\"name\":\"Mystic Shot\",\"cost\":2},\"01FR024T1\":{\"name\":\"Anivia's Harsh Winds\",\"cost\":6},\"01DE043\":{\"name\":\"War Chefs\",\"cost\":2},\"01PZ036\":{\"name\":\"Ezreal\",\"cost\":3},\"01IO028T1\":{\"name\":\"Scaled Snapper\",\"cost\":3},\"01SI048T1\":{\"name\":\"Escaped Abomination\",\"cost\":2},\"01PZ015\":{\"name\":\"T-Hex\",\"cost\":8},\"01NX053\":{\"name\":\"Reckoning\",\"cost\":6},\"01PZ005\":{\"name\":\"Hextech Transmogulator\",\"cost\":6},\"01NX038T1\":{\"name\":\"Darius's Decimate\",\"cost\":5},\"01SI052\":{\"name\":\"Thresh\",\"cost\":5},\"01DE022T1\":{\"name\":\"Lucian\",\"cost\":2},\"01DE049\":{\"name\":\"Plucky Poro\",\"cost\":1},\"01DE012T2\":{\"name\":\"Garen's Judgment\",\"cost\":8},\"01SI033\":{\"name\":\"Commander Ledros\",\"cost\":9},\"01PZ021\":{\"name\":\"Midenstokke Henchmen\",\"cost\":5},\"01SI003\":{\"name\":\"The Harrowing\",\"cost\":10},\"01SI041\":{\"name\":\"The Undying\",\"cost\":3},\"01NX040T1\":{\"name\":\"Sabotage\",\"cost\":0},\"01FR049\":{\"name\":\"Stalking Wolf\",\"cost\":2},\"01IO032T1\":{\"name\":\"Shen\",\"cost\":4},\"01DE053\":{\"name\":\"Laurent Chevalier\",\"cost\":4},\"01SI045\":{\"name\":\"Absorb Soul\",\"cost\":1},\"01FR037\":{\"name\":\"Avarosan Outriders\",\"cost\":4},\"01SI036\":{\"name\":\"Crawling Sensation\",\"cost\":1},\"01FR009T1\":{\"name\":\"Braum\",\"cost\":3},\"01IO013\":{\"name\":\"Shadow Fiend\",\"cost\":1},\"01PZ031\":{\"name\":\"Statikk Shock\",\"cost\":4},\"01SI024\":{\"name\":\"Spectral Rider\",\"cost\":2},\"01SI051\":{\"name\":\"Tortured Prodigy\",\"cost\":5},\"01FR026\":{\"name\":\"Alpha Wildclaw\",\"cost\":6},\"01NX054\":{\"name\":\"Intimidating Roar\",\"cost\":5},\"01NX006T2\":{\"name\":\"Crimson Pact\",\"cost\":0},\"01PZ059\":{\"name\":\"Golden Crushbot\",\"cost\":3},\"01NX029\":{\"name\":\"Legion Veteran\",\"cost\":4},\"01FR030\":{\"name\":\"Brittle Steel\",\"cost\":1},\"01NX014\":{\"name\":\"Shiraza the Blade\",\"cost\":4},\"01SI012\":{\"name\":\"Oblivious Islander\",\"cost\":1},\"01SI052T2\":{\"name\":\"Thresh's The Box\",\"cost\":4},\"01PZ001\":{\"name\":\"Rummage\",\"cost\":1},\"01NX042T2\":{\"name\":\"Katarina\",\"cost\":4},\"01FR013\":{\"name\":\"Scarmother Vrynna\",\"cost\":6},\"01PZ057\":{\"name\":\"Scrapdash Assembly\",\"cost\":2},\"01SI031\":{\"name\":\"Iron Harbinger\",\"cost\":3},\"01SI034\":{\"name\":\"Black Spear\",\"cost\":3},\"01SI043\":{\"name\":\"Hapless Aristocrat\",\"cost\":1},\"01IO018\":{\"name\":\"Rush\",\"cost\":1},\"01PZ056T3\":{\"name\":\"Heimerdinger's Progress Day!\",\"cost\":8},\"01FR019\":{\"name\":\"Winter's Breath\",\"cost\":7},\"01DE033\":{\"name\":\"Remembrance\",\"cost\":6},\"01SI009\":{\"name\":\"Stirred Spirits\",\"cost\":2},\"01PZ027\":{\"name\":\"Thermogenic Beam\",\"cost\":0},\"01DE045T1\":{\"name\":\"Fiora\",\"cost\":3},\"01FR041\":{\"name\":\"Avarosan Hearthguard\",\"cost\":5},\"01NX051\":{\"name\":\"Captain Farron\",\"cost\":8},\"01FR025\":{\"name\":\"Poro Herder\",\"cost\":4},\"01DE042T2\":{\"name\":\"Lux\",\"cost\":6},\"01NX012\":{\"name\":\"Legion Rearguard\",\"cost\":1},\"01DE024\":{\"name\":\"Mageseeker Conservator\",\"cost\":1},\"01SI007T1\":{\"name\":\"Unleashed Spirit\",\"cost\":1},\"01DE056\":{\"name\":\"Vanguard Firstblade\",\"cost\":4},\"01NX043\":{\"name\":\"Blade's Edge\",\"cost\":1},\"01DE030\":{\"name\":\"Silverwing Scout\",\"cost\":4},\"01IO056T1\":{\"name\":\"Staggering Strikes\",\"cost\":0},\"01SI030T1\":{\"name\":\"Kalista's Black Spear\",\"cost\":3},\"01NX037\":{\"name\":\"Legion Grenadier\",\"cost\":2},\"01NX002\":{\"name\":\"Decimate\",\"cost\":5},\"01IO016\":{\"name\":\"Zephyr Sage\",\"cost\":6},\"01SI056\":{\"name\":\"Frenzied Skitterer\",\"cost\":3},\"01NX010\":{\"name\":\"Legion General\",\"cost\":5},\"01NX017\":{\"name\":\"Legion Drummer\",\"cost\":2},\"01DE004\":{\"name\":\"Silverwing Vanguard\",\"cost\":4},\"01SI001\":{\"name\":\"Vengeance\",\"cost\":7},\"01DE011\":{\"name\":\"Laurent Protege\",\"cost\":3},\"01IO036\":{\"name\":\"Greenglade Lookout\",\"cost\":2},\"01PZ055\":{\"name\":\"Astute Academic\",\"cost\":1},\"01PZ008\":{\"name\":\"Teemo\",\"cost\":1},\"01PZ056T2\":{\"name\":\"Mk5: Rocket Blaster\",\"cost\":5},\"01PZ014\":{\"name\":\"Unlicensed Innovation\",\"cost\":6},\"01DE047\":{\"name\":\"Succession\",\"cost\":3},\"01NX003\":{\"name\":\"Arena Bookie\",\"cost\":3},\"01NX011\":{\"name\":\"Whirling Death\",\"cost\":3},\"01DE046\":{\"name\":\"Vanguard Lookout\",\"cost\":2},\"01FR054\":{\"name\":\"Scarmaiden Reaver\",\"cost\":5},\"01DE050\":{\"name\":\"Purify\",\"cost\":2},\"01FR021T1\":{\"name\":\"Tarkaz's Fury\",\"cost\":0},\"01FR043\":{\"name\":\"Heart of the Fluft\",\"cost\":6},\"01FR049T1\":{\"name\":\"Snow Hare\",\"cost\":1},\"01FR033\":{\"name\":\"Wyrding Stones\",\"cost\":3},\"01SI019\":{\"name\":\"The Box\",\"cost\":4},\"01DE042T3\":{\"name\":\"Final Spark\",\"cost\":0},\"01IO033\":{\"name\":\"Minah Swiftfoot\",\"cost\":9},\"01NX039\":{\"name\":\"Vision\",\"cost\":3},\"01FR011\":{\"name\":\"Icevale Archer\",\"cost\":2},\"01PZ034\":{\"name\":\"Sumpsnipe Scavenger\",\"cost\":4},\"01FR004\":{\"name\":\"Elixir of Iron\",\"cost\":1},\"01FR050\":{\"name\":\"Kindly Tavernkeeper\",\"cost\":3},\"01PZ014T1\":{\"name\":\"Illegal Contraption\",\"cost\":6},\"01NX041\":{\"name\":\"Trifarian Shieldbreaker\",\"cost\":5},\"01FR039T2\":{\"name\":\"Tryndamere\",\"cost\":8},\"01FR038T2\":{\"name\":\"Ashe\",\"cost\":4},\"01PZ060\":{\"name\":\"Accelerated Purrsuit\",\"cost\":5},\"01IO015\":{\"name\":\"Yasuo\",\"cost\":4},\"01IO001\":{\"name\":\"Ritual of Renewal\",\"cost\":7},\"01DE016\":{\"name\":\"Dauntless Vanguard\",\"cost\":3},\"01IO010\":{\"name\":\"Stand United\",\"cost\":6},\"01IO012\":{\"name\":\"Twin Disciplines\",\"cost\":3},\"01FR052T1\":{\"name\":\"Balesight\",\"cost\":0},\"01DE040\":{\"name\":\"Mageseeker Persuader\",\"cost\":2},\"01NX036\":{\"name\":\"Minotaur Reckoner\",\"cost\":6},\"01NX044\":{\"name\":\"Battering Ram\",\"cost\":6},\"01DE036\":{\"name\":\"Vanguard Squire\",\"cost\":4},\"01SI011\":{\"name\":\"Ravenous Butcher\",\"cost\":0},\"01IO009T3\":{\"name\":\"Zed's Shadowshift\",\"cost\":3},\"01SI042T2\":{\"name\":\"Hecarim's Onslaught of Shadows\",\"cost\":2},\"01DE037\":{\"name\":\"Riposte\",\"cost\":4},\"01PZ056T5\":{\"name\":\"Mk7: Armored Stomper\",\"cost\":7},\"01SI027\":{\"name\":\"Fresh Offerings\",\"cost\":3},\"01PZ003\":{\"name\":\"Assembly Bot\",\"cost\":3},\"01IO021\":{\"name\":\"Windfarer Hatchling\",\"cost\":7},\"01FR016\":{\"name\":\"Poro Snax\",\"cost\":3},\"01NX005\":{\"name\":\"Crimson Aristocrat\",\"cost\":2},\"01PZ040T1\":{\"name\":\"Jinx\",\"cost\":4},\"01FR005\":{\"name\":\"Battle Fury\",\"cost\":8},\"01DE014\":{\"name\":\"Reinforcements\",\"cost\":8},\"01DE013\":{\"name\":\"Chain Vest\",\"cost\":1},\"01IO009\":{\"name\":\"Zed\",\"cost\":3},\"01NX042T1\":{\"name\":\"Katarina's Death Lotus\",\"cost\":2},\"01NX016\":{\"name\":\"Trifarian Hopeful\",\"cost\":2},\"01FR009T2\":{\"name\":\"Braum's Take Heart\",\"cost\":3},\"01SI014\":{\"name\":\"Mistwraith\",\"cost\":2},\"01NX027\":{\"name\":\"Elixir of Wrath\",\"cost\":1},\"01IO027\":{\"name\":\"Silent Shadowseer\",\"cost\":2},\"01SI007\":{\"name\":\"Haunted Relic\",\"cost\":2},\"01SI022\":{\"name\":\"Mark of the Isles\",\"cost\":1},\"01IO032\":{\"name\":\"Shen\",\"cost\":4},\"01NX015\":{\"name\":\"Precious Pet\",\"cost\":1},\"01SI054\":{\"name\":\"Grasp of the Undying\",\"cost\":5},\"01PZ044\":{\"name\":\"Chempunk Shredder\",\"cost\":5},\"01FR008\":{\"name\":\"Lonely Poro\",\"cost\":1},\"01IO041\":{\"name\":\"Karma\",\"cost\":5},\"01SI006\":{\"name\":\"Possession\",\"cost\":5},\"01DE015\":{\"name\":\"Radiant Guardian\",\"cost\":5},\"01PZ029\":{\"name\":\"Eminent Benefactor\",\"cost\":4},\"01NX050\":{\"name\":\"Death Lotus\",\"cost\":2},\"01PZ056T1\":{\"name\":\"Mk0: Windup Shredder\",\"cost\":0},\"01IO031\":{\"name\":\"Cloud Drinker\",\"cost\":6},\"01DE003\":{\"name\":\"Laurent Bladekeeper\",\"cost\":4},\"01FR023\":{\"name\":\"Warmother's Call\",\"cost\":12},\"01PZ033\":{\"name\":\"Purrsuit of Perfection\",\"cost\":5},\"01SI033T1\":{\"name\":\"Blade of Ledros\",\"cost\":0},\"01PZ051\":{\"name\":\"Funsmith\",\"cost\":5},\"01SI028\":{\"name\":\"Splinter Soul\",\"cost\":3},\"01SI025\":{\"name\":\"Atrocity\",\"cost\":6},\"01IO015T2\":{\"name\":\"Yasuo's Steel Tempest\",\"cost\":3},\"01IO011\":{\"name\":\"Recall\",\"cost\":1},\"01IO009T1\":{\"name\":\"Living Shadow\",\"cost\":3},\"01IO002\":{\"name\":\"Will of Ionia\",\"cost\":4},\"01IO007T1\":{\"name\":\"Fatal Strike\",\"cost\":0},\"01FR047\":{\"name\":\"Feral Mystic\",\"cost\":2},\"01IO033T1\":{\"name\":\"Skyward Strikes\",\"cost\":0},\"01IO017\":{\"name\":\"Navori Bladescout\",\"cost\":1},\"01FR056\":{\"name\":\"Icy Yeti\",\"cost\":7},\"01NX056\":{\"name\":\"Shunpo\",\"cost\":5},\"01PZ022\":{\"name\":\"Poison Puffcap\",\"cost\":0},\"01PZ044T2\":{\"name\":\"Face-Melter\",\"cost\":0},\"01SI046\":{\"name\":\"Mist's Call\",\"cost\":3},\"01PZ033T1\":{\"name\":\"Catastrophe\",\"cost\":1},\"01NX033\":{\"name\":\"Trifarian Assessor\",\"cost\":4},\"01DE032\":{\"name\":\"Prismatic Barrier\",\"cost\":3},\"01NX006T1\":{\"name\":\"Vladimir\",\"cost\":5},\"01PZ023\":{\"name\":\"Professor von Yipp\",\"cost\":4},\"01PZ056T4\":{\"name\":\"Mk1: Wrenchbot\",\"cost\":1},\"01FR039\":{\"name\":\"Tryndamere\",\"cost\":8},\"01FR027\":{\"name\":\"Bull Elnuk\",\"cost\":4},\"01SI050\":{\"name\":\"Brood Awakening\",\"cost\":5},\"01FR057\":{\"name\":\"Pack Mentality\",\"cost\":7},\"01PZ024\":{\"name\":\"Unstable Voltician\",\"cost\":5},\"01SI016\":{\"name\":\"Wraithcaller\",\"cost\":4},\"01IO042\":{\"name\":\"Sparring Student\",\"cost\":1},\"01FR038T1\":{\"name\":\"Ashe's Flash Freeze\",\"cost\":3},\"01FR021\":{\"name\":\"Tarkaz the Tribeless\",\"cost\":5},\"01IO006\":{\"name\":\"Greenglade Duo\",\"cost\":2},\"01NX052\":{\"name\":\"Blood for Blood\",\"cost\":3},\"01IO050\":{\"name\":\"Kinkou Wayfinder\",\"cost\":4},\"01DE026\":{\"name\":\"Single Combat\",\"cost\":2},\"01NX042\":{\"name\":\"Katarina\",\"cost\":3},\"01SI021\":{\"name\":\"Shark Chariot\",\"cost\":2},\"01FR048\":{\"name\":\"Avarosan Trapper\",\"cost\":3},\"01PZ049\":{\"name\":\"Progress Day!\",\"cost\":8},\"01IO048\":{\"name\":\"Yusari\",\"cost\":5},\"01FR017\":{\"name\":\"Troop of Elnuks\",\"cost\":5},\"01IO004\":{\"name\":\"Health Potion\",\"cost\":1},\"01SI032\":{\"name\":\"Chronicler of Ruin\",\"cost\":4},\"01PZ006\":{\"name\":\"Plaza Guardian\",\"cost\":10},\"01IO007\":{\"name\":\"Ren Shadowblade\",\"cost\":8},\"01FR024T3\":{\"name\":\"Anivia\",\"cost\":7},\"01SI058\":{\"name\":\"Ethereal Remitter\",\"cost\":5},\"01PZ053\":{\"name\":\"Clump of Whumps\",\"cost\":2},\"01IO053\":{\"name\":\"Emerald Awakener\",\"cost\":3},\"01FR046\":{\"name\":\"Take Heart\",\"cost\":3},\"01NX045\":{\"name\":\"Savage Reckoner\",\"cost\":7},\"01DE027\":{\"name\":\"En Garde\",\"cost\":3},\"01SI044\":{\"name\":\"Spectral Matron\",\"cost\":8},\"01FR040\":{\"name\":\"Rimetusk Shaman\",\"cost\":5},\"01IO049\":{\"name\":\"Deny\",\"cost\":4},\"01NX031\":{\"name\":\"Trifarian Gloryseeker\",\"cost\":2},\"01PZ012\":{\"name\":\"Flame Chompers!\",\"cost\":2},\"01FR031\":{\"name\":\"Ancient Yeti\",\"cost\":7},\"01DE006\":{\"name\":\"Vanguard Sergeant\",\"cost\":3},\"01FR036T1\":{\"name\":\"Bullseye\",\"cost\":0},\"01FR053\":{\"name\":\"Mighty Poro\",\"cost\":3},\"01IO052T1\":{\"name\":\"Navori Brigand\",\"cost\":2},\"01SI039\":{\"name\":\"Arachnoid Horror\",\"cost\":2},\"01PZ039\":{\"name\":\"Get Excited!\",\"cost\":3},\"01PZ056T9\":{\"name\":\"Mk6: Stormlobber\",\"cost\":6},\"01DE038\":{\"name\":\"Senna, Sentinel of Light\",\"cost\":3},\"01FR010\":{\"name\":\"Bloodsworn Pledge\",\"cost\":4},\"01IO052\":{\"name\":\"Navori Highwayman\",\"cost\":2},\"01IO030\":{\"name\":\"The Empyrean\",\"cost\":7},\"01DE041\":{\"name\":\"Back to Back\",\"cost\":6},\"01NX006\":{\"name\":\"Vladimir\",\"cost\":5},\"01PZ016\":{\"name\":\"Flash of Brilliance\",\"cost\":3},\"01PZ036T2\":{\"name\":\"Ezreal's Mystic Shot\",\"cost\":2},\"01DE035\":{\"name\":\"For Demacia!\",\"cost\":6},\"01NX008\":{\"name\":\"Basilisk Rider\",\"cost\":4},\"01IO019\":{\"name\":\"Greenglade Caretaker\",\"cost\":1},\"01DE018\":{\"name\":\"Radiant Strike\",\"cost\":1},\"01IO054\":{\"name\":\"Insight of Ages\",\"cost\":2},\"01SI020\":{\"name\":\"The Rekindler\",\"cost\":7},\"01FR001\":{\"name\":\"Flash Freeze\",\"cost\":3},\"01PZ058\":{\"name\":\"Chump Whump\",\"cost\":4},\"01SI042\":{\"name\":\"Hecarim\",\"cost\":6},\"01DE009\":{\"name\":\"Brightsteel Protector\",\"cost\":2},\"01SI029\":{\"name\":\"Withering Wail\",\"cost\":5},\"01PZ009\":{\"name\":\"Amateur Aeronaut\",\"cost\":3},\"01IO032T2\":{\"name\":\"Shen's Stand United\",\"cost\":6},\"01SI035\":{\"name\":\"Rhasa the Sunderer\",\"cost\":8},\"01FR024\":{\"name\":\"Anivia\",\"cost\":7},\"01NX034\":{\"name\":\"Affectionate Poro\",\"cost\":1},\"01PZ042\":{\"name\":\"Intrepid Mariner\",\"cost\":2},\"01DE042\":{\"name\":\"Lux\",\"cost\":6},\"01DE045T2\":{\"name\":\"Fiora's Riposte\",\"cost\":4},\"01NX035\":{\"name\":\"Draven's Biggest Fan\",\"cost\":1},\"01FR024T5\":{\"name\":\"Glacial Storm\",\"cost\":0},\"01NX026\":{\"name\":\"Reckless Trifarian\",\"cost\":3},\"01SI004\":{\"name\":\"Darkwater Scourge\",\"cost\":3},\"01IO046\":{\"name\":\"Steel Tempest\",\"cost\":3},\"01DE039\":{\"name\":\"Cithria of Cloudfield\",\"cost\":1},\"01NX006T3\":{\"name\":\"Vladimir's Transfusion\",\"cost\":2},\"01FR043T1\":{\"name\":\"Fluft of Poros\",\"cost\":6},\"01DE029\":{\"name\":\"Fleetfeather Tracker\",\"cost\":1},\"01IO037\":{\"name\":\"Spirit's Refuge\",\"cost\":4},\"01PZ056T8\":{\"name\":\"Mk4: Apex Turret\",\"cost\":4},\"01FR024T4\":{\"name\":\"Eggnivia\",\"cost\":1},\"01PZ026\":{\"name\":\"Sumpworks Map\",\"cost\":2},\"01NX019\":{\"name\":\"Might\",\"cost\":3},\"01DE028\":{\"name\":\"Vanguard Cavalry\",\"cost\":5},\"01IO043\":{\"name\":\"Rivershaper\",\"cost\":3},\"01PZ043\":{\"name\":\"Chempunk Pickpocket\",\"cost\":2},\"01FR032\":{\"name\":\"Starlit Seer\",\"cost\":2},\"01IO038\":{\"name\":\"Solitary Monk\",\"cost\":3},\"01FR052\":{\"name\":\"She Who Wanders\",\"cost\":10},\"01FR051\":{\"name\":\"Tall Tales\",\"cost\":3},\"01NX022\":{\"name\":\"Noxian Guillotine\",\"cost\":3},\"01PZ047\":{\"name\":\"Caustic Cask\",\"cost\":0},\"01SI026\":{\"name\":\"Warden's Prey\",\"cost\":1},\"01IO012T1\":{\"name\":\"Discipline of Force\",\"cost\":3},\"01DE054\":{\"name\":\"Vanguard Redeemer\",\"cost\":3},\"01IO041T2\":{\"name\":\"Karma's Insight of Ages\",\"cost\":2},\"01IO039\":{\"name\":\"Shadowshift\",\"cost\":3},\"01NX032\":{\"name\":\"Crimson Awakener\",\"cost\":4},\"01DE023\":{\"name\":\"Mageseeker Investigator\",\"cost\":3},\"01NX024\":{\"name\":\"Kato The Arm\",\"cost\":5},\"01SI040\":{\"name\":\"Vile Feast\",\"cost\":2},\"01FR034\":{\"name\":\"They Who Endure\",\"cost\":6},\"01DE051\":{\"name\":\"Cithria the Bold\",\"cost\":6},\"01IO056\":{\"name\":\"Yone, Windchaser\",\"cost\":7},\"01IO055\":{\"name\":\"Ki Guardian\",\"cost\":2},\"01DE044\":{\"name\":\"Redoubled Valor\",\"cost\":6},\"01SI015\":{\"name\":\"The Ruination\",\"cost\":9},\"01SI052T1\":{\"name\":\"Thresh\",\"cost\":5},\"01NX049\":{\"name\":\"Guile\",\"cost\":1},\"01FR007\":{\"name\":\"Babbling Bjerg\",\"cost\":4},\"01DE012\":{\"name\":\"Garen\",\"cost\":5},\"01NX020T1\":{\"name\":\"Spinning Axe\",\"cost\":0},\"01FR003\":{\"name\":\"Avarosan Sentry\",\"cost\":2},\"01SI055\":{\"name\":\"Soulgorger\",\"cost\":6},\"01SI047\":{\"name\":\"Fading Memories\",\"cost\":0}}");

/***/ }),

/***/ "./components/tools.js":
/*!*****************************!*\
  !*** ./components/tools.js ***!
  \*****************************/
/*! exports provided: useInterval, isEmpty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useInterval", function() { return useInterval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEmpty", function() { return isEmpty; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
 // Polling Hook, credit to: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

function useInterval(callback, delay) {
  var savedCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(); // Remember the latest callback.

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    savedCallback.current = callback;
  }, [callback]); // Set up the interval.

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      var id = setInterval(tick, delay);
      return function () {
        return clearInterval(id);
      };
    }
  }, [delay]);
} // Check to see if the current object is empty or null


var isEmpty = function isEmpty(obj) {
  if (obj == null) {
    return true;
  } else {
    return Object.getOwnPropertyNames(obj).length == 0;
  }
};



/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var proton_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! proton-native */ "proton-native");
/* harmony import */ var proton_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(proton_native__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ "./app.js");



proton_native__WEBPACK_IMPORTED_MODULE_1__["AppRegistry"].registerComponent("example", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_app__WEBPACK_IMPORTED_MODULE_2__["default"], null)); // and finally render your main component
// ================================================================================
// This is for hot reloading (this will be stripped off in production by webpack)
// THIS SHOULD NOT BE CHANGED

if (true) {
  module.hot.accept([/*! ./app */ "./app.js"], function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ "./app.js");
(function () {
    var app = __webpack_require__(/*! ./app */ "./app.js")["default"];

    proton_native__WEBPACK_IMPORTED_MODULE_1__["AppRegistry"].updateProxy(app);
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));
}

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?100"))

/***/ }),

/***/ 0:
/*!*********************************************!*\
  !*** multi webpack/hot/poll?100 ./index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?100 */"./node_modules/webpack/hot/poll.js?100");
module.exports = __webpack_require__(/*! ./index.js */"./index.js");


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "proton-native":
/*!********************************!*\
  !*** external "proton-native" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("proton-native");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
//# sourceMappingURL=index.out.js.map