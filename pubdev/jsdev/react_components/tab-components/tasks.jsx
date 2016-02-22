'use strict';

var React = require('react')
var DataGrid = require('../../../node_modules/tasks-react-datagrid/react-datagrid');
var SORT_INFO;
var colsort = "id"
var valuesort = 1
var SELECTED_ID = {}
var filter = {}
var names = 'none'
var getColumn;
var check = false; 
var tab;
var datasource
var columns = 
[
    { name: 'type',  style: {color: 'black'}},
    { name: 'id',  style: {color: 'black'}},
    { name: 'status'},
    { name: 'owner',  style: {color: 'black'}},
    { name: 'entry',  style: {color: 'black'}},
    { name: 'updated',  style: {color: 'black'}}
]

function dataSource(query)
{

      	var finalarray = [];
	var sortarray = {}
	sortarray[colsort] = valuesort
	return $.ajax({
	type: 'GET',
	url: '/scot/api/v2/task',
	data: {
	limit: query.pageSize,
	offset: query.skip,
	sort:  JSON.stringify(sortarray),
	match: JSON.stringify(filter)
	}
	}).then(function(response){
  	datasource = response	
	$.each(datasource.records, function(key, value){
	finalarray[key] = {}
	$.each(value, function(num, item){
	if(num == 'created' || num == 'updated' || num == 'discovered' || num == 'occurred' || num == 'reported')
	{
	    var date = new Date(1000 * item)
	    finalarray[key][num] = date.toLocaleString()
	}
	else{
	 finalarray[key][num] = item
	}
	})
	})
	return {
	data: finalarray,	
	count: response.totalRecordCount
	}
	})
	
}
function configureTable(data, props){
    var style = {}
    if(data.status == "open")
	{
	    style.color = 'red'
	}
    else if(data.status == "closed")
	{
	    style.color = 'green'
	}
    else if(data.status == "promoted")
	{
	    style.color = 'orange'
	}
    else 
	{
	    style.color = ''
	}	

	return style;
}

module.exports = React.createClass({

    getInitialState: function(){
             return {data: dataSource, csv:true};
         },
    onColumnResize: function(firstCol, firstSize, secondCol, secondSize){
        firstCol.width = firstSize
        this.setState({})
    },

    render: function() {
	const rowFact = (rowProps) => {
	//rowProps.onDoubleClick = this
	}
	return (
	    React.createElement("div", {className: "allComponents"}, this.state.csv ? React.createElement('button', {onClick: this.exportCSV}, 'Export to CSV') : null,

	    React.createElement(DataGrid, {
            ref: "dataGrid", 
            idProperty: "id",
	    rowFactory: rowFact, 
            dataSource: this.state.data, 
            columns: columns, 
            onColumnResize: this.onColumnResize, 
	    onFilter: this.handleFilter, 
	    selected: SELECTED_ID, 
	    onSelectionChange: this.onSelectionChange, 
	    defaultPageSize:20 ,  
	    pagination: true, 
	    paginationToolbarProps: {pageSizes: [5,10,20]}, 
	    onColumnOrderChange: this.handleColumnOrderChange, 
	    sortInfo: SORT_INFO, 
	    onSortChange: this.handleSortChange, 
	    showCellBorders: true,
	    rowHeight: 100,
	    rowStyle: configureTable}
	)
        ));
    },
  exportCSV: function(){
        var keys = []
	$.each(columns, function(key, value){
            keys.push(value['name']);
	  });
	var csv = ''
	$('.z-even').each(function(key, value){
	var storearray = []
        $(value).find('.z-content').each(function(x,y) {
            var obj = $(y).text()
		obj = obj.replace(/,/g,'|')
		storearray.push(obj)
	});
	    csv += storearray.join() + '\n'
	});

	$('.z-odd').each(function(key, value){
        var storearray = []
        $(value).find('.z-content').each(function(x,y) {
            var obj = $(y).text()
		obj = obj.replace(/,/g,'|')
		storearray.push(obj)
	});
	    csv += storearray.join() + '\n'
	});
        var result = keys.join() + "\n"
	csv = result + csv;
	var data_uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
	window.open(data_uri)		
    },
    handleSortChange : function(sortInfo){
	SORT_INFO = sortInfo
	$.each(SORT_INFO, function(key,value){
	colsort = value['name']	
	valuesort = value['dir']
	})
	this.setState({})
	},
    handleColumnOrderChange : function(index, dropIndex){
	var col = columns[index]
	columns.splice(index,1)
	columns.splice(dropIndex, 0, col)
	this.setState({})
	},
    onSelectionChange: function(newSelection){
	SELECTED_ID = newSelection
	var selected = []
	Object.keys(newSelection).forEach(function(id){
	selected.push(newSelection[id].firstName)
	})
	names = selected.length? selected.join(', ') : 'none'
	this.setState({})
	check = true

	},
    handleFilter: function(column, value, allFilterValues){
	filter = {}
	Object.keys(allFilterValues).forEach(function(name){
	var columnFilter = allFilterValues[name]
	if(columnFilter == ''){
	return
	}
	if(name == "id" || name == "views"){
	filter[name] = [columnFilter]
	}
	else if(name == "created"){
	filter[name] = columnFilter;
	}
	else{
	filter[name] = columnFilter
	
	}
	})
	this.setState({})
    }
});
	




































