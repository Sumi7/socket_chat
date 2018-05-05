var socket = io();

function scrollToBottom(){
    var messages = $('.msg_container');
    var newMessage = messages.children('div.message_wrapper:last-child');
    console.log(newMessage);
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    console.log(clientHeight, scrollTop, scrollHeight, newMessageHeight, lastMessageHeight);

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    var params = getParams();
    console.log(params)
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('noerr')
        }
    })
});

socket.on('newMessage', function({ from, text, createdAt }) {
    var time = moment(createdAt).format('h:mm a');
    var msg = `<div class="message_wrapper">
                    <div>
                        <span>
                            <h5>${from}</h5>
                        <span>
                        <span>
                            <p>${time}</p>
                        </span>
                    </div>
                    <div>
                        <p>${text}</p>
                    </div>
                </div>`;
    $('.msg_container').append(msg);
    scrollToBottom();
});

socket.on('updateUserList', function(users){
    var ol = $('<ol></ol>');
    users.forEach(function(user){
        ol.append($('<li></li>').text(user));
    })
    $('#users').html(ol);
})

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

$('#msg_form').on('submit', function(e) {
    e.preventDefault();
    var msg_input = $('input[name="message"]');
    socket.emit('createMessage', {
        text: msg_input.val()
    }, () => msg_input.val(""));
})
