(function() {
    var socket,
        editor,
        options = {
            lineNumbers: true,
            lineWrapping: true,
            theme: "ambiance"
        };

    if($("body").data('rc') === 'flynn') {
        socket = io.connect('/flynn');
        options.onChange = function() {
            socket.emit('command', {
                file: $(".files .current").text(),
                contents: editor.getValue()
            });
        }

        $(".files li").click(function() {
            var file = this;
            $.get("/open/"+$(this).text(), function(data) {
                $(file).addClass("current").siblings().removeClass("current");
                editor.setValue(data);
                editor.focus();
            });
        });

        jwerty.key('ctrl+s/cmd+s', function() {
            $.post("/save", {
                file: $(".files .current").text(),
                contents: editor.getValue()
            }, function(message) {
                jQuery.toaster({showTime:1500, centerX:true, y:100}).toast(message);
            });
            return false;
        });

    } else {
        socket = io.connect('/program');
        socket.on('command', function(command) {
            editor.setOption('readOnly', false);
            editor.setValue(command.contents);
            editor.setOption('readOnly', true);
            $(".files :contains("+command.file+")").addClass("current").siblings().removeClass("current");
        });

        options.readOnly = true;
    }

    editor = CodeMirror.fromTextArea($(".editor")[0], options); 

    var resize = function() {
        var scroller = editor.getScrollerElement();
        $(scroller).height($(this).height());
        editor.refresh();
    };

    $(window).resize(resize);

    resize();

    
}())
