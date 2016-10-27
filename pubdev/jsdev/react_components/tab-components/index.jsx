'use strict';
var ReactDOM	    = require('react-dom')
var React           = require('react')
var Navbar          = require('react-bootstrap/lib/Navbar.js');
var Nav             = require('react-bootstrap/lib/Nav.js');
var NavItem         = require('react-bootstrap/lib/NavItem.js');
var NavDropdown     = require('react-bootstrap/lib/NavDropdown.js');
var MenuItem        = require('react-bootstrap/lib/MenuItem.js');
var ExpandableNav   = require('../../../node_modules/react-expandable-nav')
var ListView        = require('./list-view.jsx');
var Router	        = require('../../../node_modules/react-router').Router
var Route	        = require('../../../node_modules/react-router').Route
var Link	        = require('../../../node_modules/react-router').Link
var browserHistory  = require('../../../node_modules/react-router/').hashHistory
var Listener        = require('../activemq/listener.jsx')
var ExpandableNavContainer = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavContainer.js')
var ExpandableNavbar = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavbar.js')
var ExpandableNavHeader = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavHeader.js')
var ExpandableNavMenu = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavMenu.js')
var ExpandableNavMenuItem = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavMenuItem.js')
var ExpandableNavPage = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavPage.js')
var ExpandableNavToggleButton = require('../../../node_modules/react-expandable-nav/build/components/ExpandableNavToggleButton.js')
var SelectedContainer = require('../entry/selected_container.jsx')
var EntityDetail      = require('../modal/entity_detail.jsx')
var AMQ             = require('../debug-components/amq.jsx');
var sethome = false
var setalerts = false
var setevents = false
var setincidents = false
var setintel = false
var settask = false
var setguide = false
var setamq = false
var isalert = false
var supertableid = [];
var statetype = ''
var eventtableid = []
{
	window.React = React;	
	var $ = window.$;

}

var App = React.createClass({

    getInitialState: function(){
	    var state;
	    var id;
        var id2;
        if(this.props.params.value  != null){
            if(this.props.params.value.toLowerCase() == "home"){
                state = 0;
                sethome = true
                setintel = false
                setalerts = false
                setincidents = false
                setevents = false
                settask = false
                setguide = false
                setamq = false
            }
            else if(this.props.params.value.toLowerCase() == 'entity'){
                setguide = false
                setevents = false	
                setintel = false
                sethome = false
                setalerts = false
                setincidents = false
                settask = false
                setamq = false
                if(this.props.params.id != null) {
                    state = 8
                    //array = this.props.params.id.split('+')
                    //array.push(this.props.params.type)
                    //array.push(this.props.params.typeid)
                    id = this.props.params.id
                }
            }
            else if(this.props.params.value.toLowerCase() == 'guide'){
                setguide = true
                setevents = false	
                setintel = false
                sethome = false
                setalerts = false
                setincidents = false
                settask = false
                setamq = false
                state = 5 
                if(this.props.params.id != null) {
                    state = 5
                    statetype = 'guide'	
                    //array = this.props.params.id.split('+')
                    id = this.props.params.id
                }
            }
            else if( this.props.params.value.toLowerCase() == "alert"){
                if(this.props.params.id != null){
                    id = this.props.params.id
                    //array = this.props.params.id.split('+')
                }
                statetype = 'alert'
                state = 1
                isalert = true
                setalerts = true
                setintel = false
                sethome = false
                setincidents = false
                setevents = false
                settask = false
                setguide = false
                setamq = false
                //if the url is just /alert/ with no id - default to alertgroup
                if (this.props.params.id == null) {
                    id = null;
                    statetype = 'alertgroup'
                    isalert = false
                }
            }
            else if( this.props.params.value.toLowerCase() == "alertgroup"){
                if(this.props.params.id != null){
                    //array = this.props.params.id.split('+')
                    id = this.props.params.id;
                }
                statetype='alertgroup'
                isalert = false
                state = 1
                setalerts = true
                setintel = false
                sethome = false
                setincidents = false
                setevents = false
                settask = false
                setguide = false
                setamq = false
            }
            else if(this.props.params.value.toLowerCase() == "event"){
                state = 2
                if(this.props.params.id != null) {
                    state = 2
                    statetype = 'event'	
                    //array = this.props.params.id.split('+')
                    id = this.props.params.id
                    id2 = this.props.params.id2
                }
                setevents = true	
                setintel = false
                sethome = false
                setalerts = false
                setincidents = false
                settask = false
                setguide = false
                setamq = false
            }
            else if (this.props.params.value.toLowerCase() == "incident"){
                state = 3
                if(this.props.params.id != null) {
                    state = 3
                    statetype = 'incident'	
                    //array = this.props.params.id.split('+')
                    id = this.props.params.id
                    id2 = this.props.params.id2
                }
                setguide = false
                setincidents = true
                setintel = false
                sethome = false
                setalerts = false
                setevents = false
                settask = false
                setamq = false
            }
            else if(this.props.params.value.toLowerCase() == "intel") {
                state = 4 
                if(this.props.params.id != null) {
                    state = 4
                    statetype = 'intel'	
                    //array = this.props.params.id.split('+')
                    id = this.props.params.id
                    id2 = this.props.params.id2
                }
                setguide = false
                setintel = true
                sethome = false
                setalerts = false
                setincidents = false
                setevents = false
                settask = false
                setamq = false
            }
            else if(this.props.params.value.toLowerCase() == "task")  {
                state = 6
                setguide = false
                sethome = false
                setalerts = false
                setevents = false
                setincidents = false
                setintel = false
                settask = true
                setamq = false
            } 
            else if (this.props.params.value.toLowerCase() == "amq") {
                state = 99
                setguide = false
                sethome = false
                setalerts = false
                setevents = false
                setincidents = false
                setintel = false
                settask = false
                setamq = true
            }
            else {
                state = 0
                sethome = true
                setalerts = false
                setevents = false
                setincidents = false
                setintel = false
                settask = false
                setguide = false
                setamq = false
            }
        }
        else {
            this.props.params.value = ''
            state = 0
        }
        setTimeout(function(){Listener.activeMq()}, 3000)
        return{id: id, id2: id2, set: state, handler: "Scot", viewMode:'default'}	
    },
    componentDidMount: function() {
	    $.ajax({
	        type: 'get',
	        url: '/scot/api/v2/handler?current=1'
	    }).success(function(response){
	        this.setState({handler: response.records[0].username})
	        }.bind(this))
    },
    componentWillMount: function() {
        //Get landscape/portrait view if the cookie exists
        var viewModeSetting = checkCookie('viewMode');
        var NotificationSetting = checkCookie('Notification');
        var listViewFilterSetting = checkCookie('listViewFilter'+this.props.params.value.toLowerCase());
        var listViewSortSetting = checkCookie('listViewSort'+this.props.params.value.toLowerCase());
        var listViewPageSetting = checkCookie('listViewPage'+this.props.params.value.toLowerCase());
        this.setState({viewMode:viewModeSetting, Notification:NotificationSetting, listViewFilter:listViewFilterSetting,listViewSort:listViewSortSetting, listViewPage:listViewPageSetting})
    },
   render: function() {
	    //var array = []
	    var id = window.location.hash
	    //array = id.split('/')	
	    $('.active').on('click', function(){
	        window.location.hash = '#/' + statetype + '/'
	        window.location.href = window.location.hash
	    })
	    var headerFull = <a href='/'>Scot3</a>
        var headerSmall = ""
        var menuItemsSmall = [
        <span className = "home"></span>,
        <span className = "intel"><i className="fa fa-lightbulb-o" aria-hidden="true"></i></span>,
        <span className = "fa fa-a"></span>,
        <span className = "fa fa-e"></span>,
        <span className = "fa fa-i"></span>,
        <span className = "fa fa-t"></span>,
        <span className = "fa fa-g"></span>,
      //  <span className = "glyphicon glyphicon-cog"></span>,
        <span className = "glyphicon glyphicon-user"></span>,
        ]	

        var menuItemsFull = [
        <span>Home</span>,
        <span>Intel</span>,
        <span>Alert</span>,
        <span>Event</span>,
        <span>Incident</span>,
        <span>Tasks</span>,
        <span>Guide</span>,
        //<span>Admin</span>,
        <span>Incident Handler : {this.state.handler}</span>,
        ];
        var headerStyle = { paddingLeft: 5 };
        var fullStyle   = { paddingLeft: 50};
        var IH = 'Incident Handler: ' + this.state.handler;
        /*return (
            <div>
                <Navbar inverse fixedTop={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href='#' style={{margin:'0', padding:'0'}}><img src='scot.png' style={{width:'50px', margin:'0', padding:'0'}} /></a>
                        </Navbar.Brand>
                        <div className='presentation' style={{paddingTop:'15px',paddingBottom:'15px',paddingLeft:'15px', color:'white', display:'flex'}}>{IH}</div>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav onSelect={this.handleSelect} pullRight={true}>
                            <NavItem eventKey={1} href="#/alertgroup" active={setalerts}>Alert</NavItem>
                            <NavItem eventKey={2} href="#/event" active={setevents}>Event</NavItem>
                            <NavItem eventKey={3} href="#/incident" active={setincidents}>Incident</NavItem>
                            <NavItem eventKey={4} href="#/task" active={settask}>Task</NavItem>
                            <NavItem eventKey={5} href="#/guide" active={setguide}>Guide</NavItem>
                            <NavItem eventKey={6} href="#/intel" active={setintel}>Intel</NavItem>
                            <NavItem eventKey={7} href="incident_handler">Incident Handler</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div style={{paddingTop:'50px'}}>
                    <div>
                        <img src='/images/scot-600h.png' style={{width:'350px', height: '320px','margin-left':'auto', 'margin-right':'auto', display: 'block'}}/>
                        <h1>Sandia Cyber Omni Tracker 3.5</h1>
                        <h1>Official Use Only</h1>
                    </div>
                </div>
            </div>
        )*/
        
    return (
        React.createElement(ExpandableNavContainer, {expanded: false}, React.createElement(ExpandableNavToggleButton, {smallClass: "s", className: "shared"}),
                React.createElement(ExpandableNavbar, {fullClass: "full", smallClass: "small"}, 
                React.createElement(ExpandableNavHeader, {small: headerSmall, full: headerFull, headerStyle: headerStyle, fullStyle: fullStyle}), 
                
            React.createElement(ExpandableNavMenu, null, 
            
                    React.createElement(ExpandableNavMenuItem, {active:setalerts ,small: menuItemsSmall[2], full: menuItemsFull[2], tooltip: "Alert", jquery: window.$, onClick: this.handleAlerts}),
                React.createElement(ExpandableNavMenuItem, {active: setevents,small: menuItemsSmall[3], full: menuItemsFull[3], tooltip: "Event", jquery: window.$,onClick: this.handleEvents}),
                React.createElement(ExpandableNavMenuItem, {active: setincidents,small: menuItemsSmall[4], full: menuItemsFull[4], tooltip: "Incident", jquery: window.$, onClick: this.handleIncidents}),
                    React.createElement(ExpandableNavMenuItem, {active: settask, small: menuItemsSmall[5], full: menuItemsFull[5], tooltip: "Task", jquery: window.$, onClick: this.handleTasks}),
            React.createElement(ExpandableNavMenuItem, {active: setguide, small: menuItemsSmall[6], full: menuItemsFull[6], tooltip: "Guide", jquery: window.$, onClick: this.handleGuide}),
        //            React.createElement(ExpandableNavMenuItem, {small: menuItemsSmall[7], full: menuItemsFull[7], tooltip: "Admin", jquery: window.$, onClick:this.handlePad}),
            React.createElement(ExpandableNavMenuItem, {active: setintel,small: menuItemsSmall[1], full: menuItemsFull[1], tooltip: "Intel", jquery: window.$, onClick: this.handleIntel}),
            React.createElement(ExpandableNavMenuItem, {small: menuItemsSmall[7], full: menuItemsFull[7], tooltip: "Incident Handler Calendar", jquery: window.$, onClick: this.handleHandler}) 
                )

            ),
            this.state.set == 0 
        ?
        React.createElement(ExpandableNavPage, null, React.createElement('div', {className: 'Text'}, React.createElement('img', {src: '/images/scot-600h.png', style: {width:'350px', height: '320px','margin-left':'auto', 'margin-right':'auto', display: 'block'}}), React.createElement('h1', null, "Sandia Cyber Omni Tracker, v. 3.5"), React.createElement('h1', null, 'Official Use Only')))  
            :
        this.state.set == 1
        ?	
        React.createElement(ExpandableNavPage, null, React.createElement(ListView, {isalert: isalert ? 'isalert' : '', id: this.state.id, viewMode: this.state.viewMode, type:statetype, Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))	
        :
            this.state.set == 2
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(ListView, {id: this.state.id, id2: this.state.id2, viewMode: this.state.viewMode, type:'event',  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))	
        :
            this.state.set == 3
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(ListView, {id: this.state.id, id2: this.state.id2, viewMode: this.state.viewMode, type:'incident',  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))	
        :
        this.state.set == 5
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(SelectedContainer, {id: this.state.id, type: statetype, viewMode: this.state.viewMode,  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))
        :
        this.state.set == 4
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(ListView, {id: this.state.id, id2: this.state.id2, viewMode: this.state.viewMode, type: 'intel',  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))
        :
        this.state.set == 6
        ?	
        React.createElement(ExpandableNavPage, null, React.createElement(ListView, {viewMode: this.state.viewMode, type:'task',  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))	
        :
        this.state.set == 7
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(ListView, {id: this.state.id, viewMode: this.state.viewMode, type:'guide',  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage}))
        :
        this.state.set == 8
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(EntityDetail, {entityid: this.state.id, entitytype: 'entity', id: this.state.id, type: 'entity', viewMode: this.state.viewMode,  Notification:this.state.Notification, listViewFilter:this.state.listViewFilter, listViewSort:this.state.listViewSort, listViewPage:this.state.listViewPage, fullScreen:true}))
        :
        this.state.set = 99
        ?
        React.createElement(ExpandableNavPage, null, React.createElement(AMQ, {type: 'amq'}))
        :
        null
        )	
        );

    },
    handleSelect: function(selectedKey) {
        switch(selectedKey) {
            case 0:
                this.setState({set:0});
                break;
            case 1:
                window.location.hash = '#/alertgroup';
                window.location.href = window.location.hash;
                break;
            case 2:
                window.location.hash = '#/event';
                window.location.href = window.location.hash;
                break;
            case 3:
                window.location.hash = '#/incident';
                window.location.href = window.location.hash;
                break;
            case 4:
                window.location.hash = '#/task';
                window.location.href = window.location.hash;
                break;
            case 5:
                window.location.hash = '#/guide';
                window.location.href = window.location.hash;
                break;
            case 6:
                window.location.hash = '#/intel';
                window.location.href = window.location.hash;
                break;
            case 7:
                window.open('incident_handler.html');
                break;
       }
    },
    handleGuide: function(){
        window.location.hash = '#/guide/'
        window.location.href = window.location.hash
    },
    handleIntel: function(){
        window.location.hash = '#/intel/'
        window.location.href = window.location.hash
    },
    handleHome: function(){
        this.setState({set:0})
    }, 
    handleHandler: function(){
	    window.open('incident_handler.html')
    },
    handleAlerts: function(){
        window.location.hash = '#/alertgroup/'
        window.location.href = window.location.hash
    },
    handleEvents: function(){
        window.location.hash = '#/event/'
        window.location.href = window.location.hash
    },
    handleIncidents: function(){
        window.location.hash = '#/incident/'
        window.location.href = window.location.hash
    },
    handleTasks: function(){
        window.location.hash = '#/task/'
        window.location.href = window.location.hash
    },
    handlePad: function(){
	    //window.open('scratchpad.html')
    },
    handlePlugin: function(){
	    window.open('plugin.html')
    },
});

    ReactDOM.render((
        <Router history = {browserHistory}>
        <Route path = '/' component = {App} />
        <Route path = '/:value' component = {App} />
        <Route path = '/:value/:id' component = {App} />
        <Route path = '/:value/:id/:id2' component = {App} />
        <Route path = '/:value/:id/:type/:typeid' component = {App} />
        </Router>
    ), document.getElementById('content'))

