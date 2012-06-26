var socket,
    editor,
    update = function() {};

if($("body").data('rc') === 'flynn') {
    socket = io.connect('/flynn');
    update = function() {
        console.log("Code has changed!");
        socket.emit('command', editor.getValue());
    }
} else {
    socket = io.connect('/program');
    socket.on('command', function(command) {
        editor.setValue(command);
    });
}

editor = CodeMirror.fromTextArea($(".editor")[0], {
    lineNumbers: true,
    theme: "ambiance",
    onChange: update
}); 
