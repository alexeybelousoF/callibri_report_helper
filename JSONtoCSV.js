// JSON to CSV


function json_to_csv() {
	
    //Берем джос и формирует сиэсви
    json_data = localStorage.getItem('report_data');
    json_data = json_data.replace(/\s+/g, ' ').trim();// - spaces
	var report_data_obj = JSON.parse(json_data);// now obj

	const opts = { report_data_obj };
	opts.header = false;
	opts.includeEmptyRows = true;

	try {
	 	const report_parser = new json2csv.Parser(opts);
	 	const csv = report_parser.parse(report_data_obj);
	 	console.log(csv);
		//return true;
		var csvData = 'data:application/txt;charset=utf-8,' + encodeURIComponent(csv);
		document.getElementById('report_bot').remove();
		document.querySelector('.column-tickets-header').innerHTML = '<a id="download_file">Скачать</a>';
		var download_file = document.getElementById('download_file');
	    download_file.href = csvData;
	    download_file.target = '_blank';
	    download_file.download = 'file.csv';
		  
	} 
	catch (err) {
		  console.error(err);
	}
}



	
