var Header = React.createClass({
    render: function () {
        return (
            <header className="bar bar-nav">
                <a href="#" className={"icon icon-left-nav pull-left" + (this.props.back==="true"?"":" hidden")}></a>
                <h1 className="title">{this.props.text}</h1>
            </header>
        );
    }
});

var SearchBar = React.createClass({
    searchHandler: function() {
        this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="bar bar-standard bar-header-secondary">
                <input type="search" ref="searchKey" onChange={this.searchHandler} value={this.props.searchKey}/>
            </div>

        );
    }
});

var UserListItem = React.createClass({
    render: function () {
        return (
            <li className="table-view-cell media">
                <a href={"#users/" + this.props.user.id}>
                    <img className="media-object small pull-left" src={"pics/" + this.props.user.picId +  ".jpg" }/>
                    {this.props.user.username} {this.props.user.administrator}
                    <p>{this.props.user.username}</p>
                </a>
            </li>
        );
    }
});

var UserList = React.createClass({
    render: function () {
        var items = this.props.users.map(function (user) {
            return (
                <UserListItem key={user.id} user={user} />
            );
        });
        return (
            <ul  className="table-view">
                {items}
            </ul>
        );
    }
});

var HomePage = React.createClass({
    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Zoomdata User Directory" back="false"/>
                <SearchBar searchKey={this.props.searchKey} searchHandler={this.props.searchHandler}/>
                <div className="content">
                    <UserList users={this.props.users}/>
                </div>
            </div>
        );
    }
});

var UserPage = React.createClass({
    getInitialState: function() {
        var user = {};
        user.created = {};
        user.created.by = {};
        user.lastModified = {};
        user.lastModified.by = {};
        user.picId = "1";
        return {user: user};
    },
    componentDidMount: function() {
        this.props.service.findById(this.props.userId).done(function(result) {
            this.setState({user: result});
        }.bind(this));
    },
    render: function () {
        if (!this.state.user.created.by){
            this.state.user.created.by ={};
        }
        if (!this.state.user.lastModified.by){
            this.state.user.lastModified.by ={};
        }
        return (
            <div className={"page " + this.props.position}>
                <Header text="Zoomdata User" back="true"/>
                <div className="card">
                    <ul className="table-view">
                        <li className="table-view-cell media">
                            <img className="media-object big pull-left" src={"pics/" + this.state.user.picId + ".jpg" }/>
                            <h1>{this.state.user.username} {this.state.user.administrator}</h1>
                            <p>{this.state.user.username}</p>
                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                User Name
                                    <p>{this.state.user.username}</p>
                                </div>
                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                Enabled
                                    <p>{this.state.user.enabled}</p>
                                </div>

                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                Administrator
                                    <p>{this.state.user.administrator}</p>
                                </div>
                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                Created On
                                    <p>{this.state.user.created.on}</p>
                                </div>
                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                    Created By
                                    <p>{this.state.user.created.by.username}</p>
                                </div>
                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                    Last Modified On
                                    <p>{this.state.user.lastModified.on}</p>
                                </div>
                        </li>
                        <li className="table-view-cell media">
                                <span className="media-object pull-left"></span>
                                <div className="media-body">
                                    Last Modified By
                                    <p>{this.state.user.lastModified.by.username}</p>
                                </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    mixins: [PageSlider],
    getInitialState: function() {
        return {
            searchKey: '',
            users: []
        }
    },
    searchHandler: function(searchKey) {
        userService.findByName(searchKey).done(function(users) {
            this.setState({
                searchKey:searchKey,
                users: users,
                pages: [<HomePage key="list" searchHandler={this.searchHandler} searchKey={searchKey} users={users}/>]});
        }.bind(this));
    },
    componentDidMount: function() {
        userService.findAllUsers().done(function(users) {
            this.setState({
                users: users,
                pages: [<HomePage key="list" searchHandler={this.searchHandler} searchKey='' users={users}/>]});
        }.bind(this));
        router.addRoute('', function() {
            this.slidePage(<HomePage key="list" searchHandler={this.searchHandler} searchKey={this.state.searchKey} users={this.state.users}/>);
        }.bind(this));
        router.addRoute('users/:id', function(id) {
            this.slidePage(<UserPage key="details" userId={id} service={userService}/>);
        }.bind(this));
        router.start();
    }
});

React.render(<App/>, document.body);