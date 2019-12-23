"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var value_types_1 = require("./value-types");
var MentionSanitizer_1 = require("./mentions/MentionSanitizer");
var url = require("./helpers/url");
var funcs_html_1 = require("./funcs-html");
var OpAttributeSanitizer = (function () {
    function OpAttributeSanitizer() {
    }
    OpAttributeSanitizer.sanitize = function (dirtyAttrs, sanitizeOptions) {
        var cleanAttrs = {};
        if (!dirtyAttrs || typeof dirtyAttrs !== 'object') {
            return cleanAttrs;
        }
        var booleanAttrs = [
            'bold', 'italic', 'underline', 'strike', 'code',
            'blockquote', 'code-block', 'renderAsBlock'
        ];
        var colorAttrs = ['background', 'color'];
        var font = dirtyAttrs.font, size = dirtyAttrs.size, link = dirtyAttrs.link, script = dirtyAttrs.script, list = dirtyAttrs.list, header = dirtyAttrs.header, align = dirtyAttrs.align, direction = dirtyAttrs.direction, indent = dirtyAttrs.indent, mentions = dirtyAttrs.mentions, mention = dirtyAttrs.mention, width = dirtyAttrs.width, target = dirtyAttrs.target, rel = dirtyAttrs.rel;
        var sanitizedAttrs = ['font', 'size', 'link', 'script', 'list', 'header', 'align',
            'direction', 'indent', 'mentions', 'mention', 'width',
            'target', 'rel'
        ];
        booleanAttrs.forEach(function (prop) {
            var v = dirtyAttrs[prop];
            if (v) {
                cleanAttrs[prop] = !!v;
            }
        });
        colorAttrs.forEach(function (prop) {
            var val = dirtyAttrs[prop];
            if (val && (OpAttributeSanitizer.IsValidHexColor(val + '') ||
                OpAttributeSanitizer.IsValidColorLiteral(val + '') ||
                OpAttributeSanitizer.IsValidRGBColor(val + ''))) {
                cleanAttrs[prop] = val;
            }
        });
        if (font) {
            cleanAttrs.font = font;
        }
        if (size) {
            cleanAttrs.size = size;
        }
        if (width) {
            cleanAttrs.width = width;
        }
        if (list && OpAttributeSanitizer.IsValidList(list)) {
            cleanAttrs.list = list;
        }
        if (link) {
            cleanAttrs.link = OpAttributeSanitizer.sanitizeLinkUsingOptions(link + '', sanitizeOptions);
        }
        if (target) {
            cleanAttrs.target = target;
        }
        if (rel) {
            cleanAttrs.rel = rel;
        }
        if (script === value_types_1.ScriptType.Sub || value_types_1.ScriptType.Super === script) {
            cleanAttrs.script = script;
        }
        if (Number(header)) {
            cleanAttrs.header = Math.min(Number(header), 6);
        }
        if (align) {
            cleanAttrs.align = align;
        }
        if (direction) {
            cleanAttrs.direction = direction;
        }
        if (indent) {
            cleanAttrs.indent = indent;
        }
        if (mentions && mention) {
            var sanitizedMention = MentionSanitizer_1.MentionSanitizer.sanitize(mention, sanitizeOptions);
            if (Object.keys(sanitizedMention).length > 0) {
                cleanAttrs.mentions = !!mentions;
                cleanAttrs.mention = mention;
            }
        }
        return Object.keys(dirtyAttrs).reduce(function (cleaned, k) {
            if (sanitizedAttrs.indexOf(k) === -1) {
                cleaned[k] = dirtyAttrs[k];
            }
            ;
            return cleaned;
        }, cleanAttrs);
    };
    OpAttributeSanitizer.sanitizeLinkUsingOptions = function (link, options) {
        var sanitizerFn = function () { return undefined; };
        if (options && typeof options.urlSanitizer === 'function') {
            sanitizerFn = options.urlSanitizer;
        }
        var result = sanitizerFn(link);
        return typeof result === 'string' ?
            result :
            funcs_html_1.encodeLink(url.sanitize(link));
    };
    OpAttributeSanitizer.IsValidHexColor = function (colorStr) {
        return !!colorStr.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i);
    };
    OpAttributeSanitizer.IsValidColorLiteral = function (colorStr) {
        return !!colorStr.match(/^[a-z]{1,50}$/i);
    };
    OpAttributeSanitizer.IsValidRGBColor = function (colorStr) {
        var re = /^rgb\(((0|25[0-5]|2[0-4]\d|1\d\d|0?\d?\d),\s*){2}(0|25[0-5]|2[0-4]\d|1\d\d|0?\d?\d)\)$/i;
        return !!colorStr.match(re);
    };
    OpAttributeSanitizer.IsValidFontName = function (fontName) {
        return !!fontName.match(/^[a-z\s0-9\- ]{1,30}$/i);
    };
    OpAttributeSanitizer.IsValidSize = function (size) {
        return !!size.match(/^[a-z0-9\-]{1,20}$/i);
    };
    OpAttributeSanitizer.IsValidWidth = function (width) {
        return !!width.match(/^[0-9]*(px|em|%)?$/);
    };
    OpAttributeSanitizer.isValidTarget = function (target) {
        return !!target.match(/^[_a-zA-Z0-9\-]{1,50}$/);
    };
    OpAttributeSanitizer.IsValidRel = function (relStr) {
        return !!relStr.match(/^[a-zA-Z\s\-]{1,250}$/i);
    };
    OpAttributeSanitizer.IsValidList = function (list) {
        return !!list.match(/^bullet|(ordered(:[aAiI1])?)$/);
    };
    return OpAttributeSanitizer;
}());
exports.OpAttributeSanitizer = OpAttributeSanitizer;
