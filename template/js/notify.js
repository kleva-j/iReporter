
// simulate an event
const customEvent = (event) => {
  event.preventDefault();
  
  if (!window.Notification) alert('Sorry Notifications are not supported on this browser');
  Notification.requestPermission();

  let notify;
  if (Notification.permission === 'denied') alert('You have to allow notification to receive notifications');
  notify = new Notification('New message from Alex', {
    body: 'How are you today, it realy is a lovely day',
    icon: '../images/246x0w.jpg',
    tag: '1234'
  });

  notify.onclick = function(e){
    window.location= `?messages=${this.tag}`;
  }
} 

function notification() {
  const bell = document.querySelector('.fas.fa-bell');
  bell.addEventListener('click', customEvent)
}

notification();
