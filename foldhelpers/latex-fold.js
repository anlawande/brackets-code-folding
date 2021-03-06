/**
 * Fold latex code regions
 * @author Patrick Oladimeji
 * @date 11/29/13 10:56:52 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, CodeMirror */
define(function (require, exports, module) {
    "use strict";
    module.exports = function (cm, start) {
        var line = start.line, lineText = cm.getLine(line);
        var startToken, endToken, tokenType = null;
        var startRegex = /^([\\](?:section|subsection|subsubsection|begin)\*?\s*\{)([\w\s\d\(\)\,\.\?]+)\}/;
        ///fixme the matches for subsection and subsubections are wrong
        function findClose(match, context) {
            function find(regex) {
                var i, lineText, lastLine = cm.lastLine();
                for (i = line + 1; i < lastLine; i++) {
                    lineText = cm.getLine(i);
                    var endTag = regex.exec(lineText);
                    if (endTag) { return {line: i, ch: endTag.index}; }
                }
                return {line: i + 1, ch: 0};
            }
            
            var regex;
            if (match.indexOf("\\begin") === 0) { //look for \end{context}
                regex = new RegExp("\\end\\s*\\{" + context + "\\}");
            } else {
                regex = new RegExp("\\" + match);
                if (match.indexOf("\\subsection") === 0) {
                    regex = /^([\\](?:subsection|section)\*?\s*\{)([\w\s\d\(\)\,\.\?]+)\}/;
                } else if (match.indexOf("\\subsubsection") === 0) {
                    regex = /^([\\](?:subsubsection|subsection|section)\*?\s*\{)([\w\s\d\(\)\,\.\?]+)\}/;
                }
                var pos = find(regex);
                if (pos) {
                    pos.line = pos.line - 1;
                }
                return pos;
            }
            return find(regex);
        }
        
        var matches = startRegex.exec(lineText);
        
        if (!matches) { return null; }
        //find the close tag depending on the match
        var end = findClose(matches[1], matches[2]);
        if (!end) { return null; }
        return {from: CodeMirror.Pos(line, matches.index + matches[0].length),
            to: CodeMirror.Pos(end.line, end.ch)};
    };
});
