/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../public/content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../public/content.js":
/*!****************************!*\
  !*** ../public/content.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// /* global chrome */\ndocument.addEventListener('DOMContentLoaded', function () {\n  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {\n  //   console.log(\"message received\", request)\n  //   switch(request.action) {\n  //     case 'toggle':\n  //       break;\n  //     default:\n  //       console.log(\"request: \", request)\n  //   }\n  // })\n});\n// chrome.browserAction.onClicked.addListener(() => alert(\"HEY\"))\n\n// window.addEventListener(\"mouseup\", () => {\n//   let selectedText = window\n//     .getSelection()\n//     .toString()\n//     .trim();\n//   let ingredients = parseToArray(selectedText);\n//   if (ingredients.length) {\n//     let message = {\n//       ingredients: ingredients\n//     };\n//     chrome.runtime.sendMessage(message);\n//   }\n// });\n\n// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {\n//   switch (request.type) {\n//     case \"openModal\":\n//       chrome.storage.sync.set({\n//           'cbIsModal': true\n//       });\n//       document.body.innerHTML +=`<dialog style=\"height:315px; width:300px; background-color:#F2F2F2;\" id=\"cookbook-dialog\">\n//           <iframe style=\"height:290px; width:292px; position:absolute; top:25; left:0\" id=\"cookbookFrame\"></iframe>\n//           <div style=\"position:absolute; top:0px; left:5px;\"><button>x</button></div></dialog>`;\n//       let iframe = document.getElementById(\"cookbookFrame\");\n//       iframe.src = chrome.extension.getURL(\"index.html\");\n//       iframe.frameBorder = 0;\n//       let dialog = document.querySelector(\"dialog\");\n//       dialog.querySelector(\"button\").addEventListener(\"click\", function() {\n//         dialog.close();\n//       });\n//       dialog.showModal();\n//     case \"closeModal\":\n//   }\n// });\n\n// // Helper functions\n// window.parseToArray = string => {\n//   let arr = string.split(/\\n/);\n//   arr.forEach((str, index) => {\n//     // Take out unnecesary text\n//     let cutOffs = [str.indexOf(\",\"), str.indexOf(\"(\")];\n//     cutOffs.forEach(index => {\n//       if (index > 5) {\n//         str = str.substring(0, index);\n//       } else if (index > 0) {\n//         if (str.includes(\"can\")) {\n//           str = convertFromCan(str, \"can\");\n//         } else if (str.includes(\"jar\")) {\n//           str = convertFromCan(str, \"jar\");\n//         }\n//       }\n//     });\n//     arr[index] = str.trim();\n//     // Check for empty strings\n//     if (!str.replace(/\\s/g, \"\").length) {\n//       arr[index] = undefined;\n//     }\n//   });\n//   // Remove empty strings\n//   arr = arr.filter(el => el !== undefined);\n//   return arr;\n// };\n\n// window.convertFromCan = (str, canOrJar) => {\n//   let realUnits = str.substring(str.indexOf(\"(\") + 1, str.indexOf(\")\"));\n//   return realUnits + str.substring(str.indexOf(canOrJar) + 3);\n// };\n\n// window.closeModal = () => {\n//   let dialog = document.querySelector(\"dialog\");\n//   dialog.close();\n// }\n\n//# sourceURL=webpack:///../public/content.js?");

/***/ })

/******/ });