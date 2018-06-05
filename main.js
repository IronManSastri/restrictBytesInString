    function checkForBytes(e, limiter, msg) {
        var localData;
        var that = $(e.target);
        var limit = limiter;
        if (e.type !== 'paste') {
            //checking the bytes length up to the user typed value
            var checkText = byteLength(that.val(), limit);
            var localCount = checkText.trucatedBytesCount;
            var totalbytes = checkText.completeStringbytes;
            //condition to check the limit given to the amount of bytes typed by the user
            if (totalbytes > limit) {
                if ($('#remainingNumber').length == 0) {
                    $(e.target).after('<p id="remainingNumber" class="bg-warning">' + msg + '</p>')
                }
                that.val(checkText.truncatedstring);
                e.preventDefault();
                return false;
            } else {
                $('#remainingNumber').remove();
            }
        } else {
            setTimeout(function () {
                var initialStateOfValue = that.val();
                localData = byteLength(that.val(), limiter);
                if (localData.trucatedBytesCount <= limit) {
                    that.val(localData.truncatedstring);
                } else {
                    if ($('#remainingNumber').length == 0) {
                        $(e.target).after('<p id="remainingNumber" class="bg-warning">' + msg + '</p>')
                    }
                    that.val(localData.truncatedstring.substr(0, localData.truncatedstring.length - 1));
                }
            }, 0)
        }
    }

    function byteLength(str, limiter) {
        var stringLength = str.length;
        var bytesCount = 0;
        var localString = "";
        var singleBytes = 0;
        var twoBytes = 0;
        var threeBytes = 0;
        var others = 0;
        var trucatedBytesCount = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            if (code <= 0x7f) { //equal to 1
                bytesCount += 1;
                stringLength++;
                singleBytes += 1;
            } else if (code > 0x7f && code <= 0x7ff) { // equal to 2
                bytesCount += 2;
                stringLength += 2;
                twoBytes += 2;
            } else if ((code > 0x7ff && code <= 0xffff)) { //equal to 3
                bytesCount += 3;
                stringLength += 3;
                threeBytes += 3;
            } else {
                bytesCount += 4;
                stringLength += 4;
                others += 4;
            }
        }
        completeStringbytes = singleBytes + twoBytes + threeBytes + others;
        singleBytes = 0;
        twoBytes = 0;
        threeBytes = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            if (code <= 0x7f) { //equal to 1
                trucatedBytesCount += 1;
                stringLength++;
                singleBytes += 1;
            } else if (code > 0x7f && code <= 0x7ff) { // equal to 2
                trucatedBytesCount += 2;
                stringLength += 2;
                twoBytes += 2;
            } else if ((code > 0x7ff && code <= 0xffff)) { //equal to 3
                trucatedBytesCount += 3;
                stringLength += 3;
                threeBytes += 3;
            } else {
                trucatedBytesCount += 4;
                stringLength += 4;
                others += 4;
            }
            if (trucatedBytesCount >= limiter) {
                localString = str.substr(0, singleBytes + (twoBytes / 2) + (threeBytes / 3) + (others / 4));
                break;
            } else {
                localString = str;
            }
        }
        localObj = {
            completeStringbytes: completeStringbytes,
            trucatedBytesCount: trucatedBytesCount,
            truncatedstring: localString
        }
        return localObj;
    }