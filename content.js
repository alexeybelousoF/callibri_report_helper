// content.js

  // Создадим бота, который будет ходить по тикетам
  function walkin_bot () {

    get_report();

   var active_ticket = document.querySelector('.list-group-item.active');
   // Если нет активного, но нас вызвали - значит на новой вкладке - кликаем на последний
   if (!active_ticket) {
    document.querySelector('.tickets-list > a:nth-last-child(2)').click();
    autobot();
    return false;
   }
   // Если нет предыдущих - значит идем на новую вкладку
   if (!active_ticket.previousElementSibling) {
    if (document.querySelector('.current') && document.querySelector('.current').textContent != '1') {
      // Если еще не на первой - го на предыдущую
      document.querySelector('.previous_page').click();
      autobot();
      return false;
    } else {
      json_to_csv();
      return true;// Вырубаем тут!!!!!
    }
   }
    active_ticket.previousElementSibling.click();
    autobot();
    return false;
  }

  // Создадим бота, который соберет все данные
  function get_report() {
    var ticketLink = window.location.href;
    if (ticketLink.includes('?')) {
      var ticketreplace = /\?.+#/;
      ticketLink = ticketLink.replace(ticketreplace, '#');
    }

    if (ticketLink.includes('admin')){
      ticketLink = ticketLink.replace('admin/tickets#', 'tickets/')
    }

    if (ticketLink.includes('#')) {
      ticketreplace = /[^\/]*\d[#]/;
      ticketLink = ticketLink.replace(ticketreplace, '')
    }

    var basecamp = document.querySelector('[data-bip-attribute="basecamp_task"]').textContent;
    // Ссылка на задачу
    if ( basecamp === 'Добавить' ){
      basecamp = '';
    }
    ticket_theme = document.querySelector('.form-header-main-info').textContent;
    reg_theme = /[#\d]/gm;
    ticket_theme = ticket_theme.replace(reg_theme, '');
    ticket_theme = ticket_theme.replace("[]", '');
    ticket_date = document.querySelector('.datetime').textContent.trim();
    let report_data_obj = [ticket_theme, ticketLink,'', ticket_date,'', basecamp];
    var json_data = localStorage.getItem('report_data');
    let Report_Data = JSON.parse(json_data);
    Report_Data = Object.values(Report_Data);
    Report_Data.push(report_data_obj);
    //console.log('')
    Report_Data = JSON.stringify(Report_Data);
    localStorage.setItem('report_data', Report_Data);
  }

  // Функция автобот - автоматический запуск бота, если валкинбот вернул фолс
  function autobot(state) {
    //Отслеживаем изменение URL
    if (state) {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if ( request.message == "urlUpdated" ) {
          walkin_bot();
        }
      });
    } else {
      setTimeout(function(){
      walkin_bot();
      }, 1500);
    }
  }


// страничка загрузилась
window.addEventListener('load',  function (request, sender, sendResponse) {
  localStorage.setItem('report_data', '{}' );
  document.querySelector('.column-tickets-header').innerHTML = '<a id="report_bot">Погнали</a>';
  document.getElementById('report_bot').addEventListener('click', function() {
    walkin_bot();
  });

});
