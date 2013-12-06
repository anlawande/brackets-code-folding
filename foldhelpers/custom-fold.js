/**
 * CodeMirror brace-fold addon
 * Slightly modularised by Patrick Oladimeji
 * @date 10/24/13 8:26:34 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, continue: true, eqeq: true*/
/*global define, d3, require, $, brackets, window, MouseEvent, CodeMirror*/
// region customRegion

// region some other region

// endregion

// endregion
define(function (require, exports, module) {
    "use strict";
    module.exports = function (cm, start) {
        var line = start.line, lineText = cm.getLine(line);
        var startCh, tokenType = null;
        var openRegion = "// region";
        var closeRegion = "// endregion";

        function findOpening(openRegion) {
            var tokenText, startCh;
            var found = lineText.indexOf(openRegion);
            if(found !== -1) {
                var startPos = found + openRegion.length;
                tokenText = lineText.substr(startPos);
                startCh = lineText.length;
            }
            return {
                startCh : startCh,
                tokenText : tokenText
            };
            //if (!/^(comment|string)/.test(tokenType)) { return found + 1; }
        }

        var startToken = findOpening(openRegion);
        startCh = startToken.startCh;
        
        if (startCh === null || startCh === undefined) { return; }
        var lastLine = cm.lastLine(), end, endCh, i;
        var trackRegionsCnt = 0;
/*outer:  for (i = line; i <= lastLine; ++i) {
            var text = cm.getLine(i), pos = i === line ? startCh : 0;
            for (;;) {
                var nextOpen = text.indexOf(startToken, pos), nextClose = text.indexOf(endToken, pos);
                if (nextOpen < 0) { nextOpen = text.length; }
                if (nextClose < 0) { nextClose = text.length; }
                pos = Math.min(nextOpen, nextClose);
                if (pos === text.length) { break; }
                if (cm.getTokenTypeAt(CodeMirror.Pos(i, pos + 1)) == tokenType) {//need == here cos tokenType can be null or undefined
                    if (pos === nextOpen) {
                        ++count;
                    } else if (!--count) {
                        end = i;
                        endCh = pos;
                        break outer;
                    }
                }
                ++pos;
            }
        }*/
        // TODO for now only per line regions
        for (i = line + 1; i <= lastLine; ++i) {
            var text = cm.getLine(i);
            if(text.indexOf(openRegion) !== -1)
                ++trackRegionsCnt;
            if(text.indexOf(closeRegion) !== -1)
                --trackRegionsCnt;
            
            if(trackRegionsCnt < 0) {
                end = i;
                break;
            }
        }
        
        if (end === null || end === undefined || (line === end && endCh === startCh)) { return; }
        
        endCh = cm.getLine(end).length;
        
        return {from: CodeMirror.Pos(line, startCh),
            to: CodeMirror.Pos(end, endCh)};
    };
});
