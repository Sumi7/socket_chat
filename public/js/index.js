var socket = io();

socket.on('connect', function(){
  console.log('connected to server');
});

socket.on('newMessage', function({from, text}){
  var msg = `<div>${from}: ${text}</div>`;
  $('.msg_container').append(msg);
});

socket.on('disconnect', function(){
  console.log('disconnected from server');
});

$('#msg_form').on('submit', function(e){
  e.preventDefault();
  var msg_input = $('input[name="message"]');
  socket.emit('createMessage', {
    from: 'User 1',
    text: msg_input.val()
  }, () => msg_input.val(""));
})
