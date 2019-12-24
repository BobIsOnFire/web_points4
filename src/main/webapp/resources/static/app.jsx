class DynamicTable extends React.Component {
    render() {
        // elems, rows, cols, className, colWidth
        const trs = [];
        const elems = this.props.elems;
        const rows = +this.props.rows;
        const cols = +this.props.cols;
        const colStyle = this.props.colWidth.map(value => { return {width: value} });

        let i = 0;
        while (i < rows) {
            const tds = [];
            for (let j = 0; j < cols && i * cols + j < elems.length; j++ ) {
                tds.push(<td style={colStyle[j]} key={j}>{ elems[i * cols + j] }</td>);
            }
            trs.push(<tr key={i}>{tds}</tr>);
            i++;
        }

        return <table className={this.props.className}><tbody>{trs}</tbody></table>
    }
}

class LoginApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0
        };

        document.cookie = "user_id=0; max-age=0";
    }

    render() {
        const tabs = [
            <ToolBarTab tab={
                {
                    selected: this.state.currentTab === 0,
                    name: "Авторизация",
                    onclick: () => this.handleClick(0)
                }
            }/>,
            <ToolBarTab tab={
                {
                    selected: this.state.currentTab === 1,
                    name: "Регистрация",
                    onclick: () => this.handleClick(1)
                }
            }/>
        ];

        const header = [
            <div>Акатьев Никита Львович группа P3211<br/>Лабораторная №4</div>,
            <Timer interval="1000" /> // todo theme switch button?
        ];

        const form = this.state.currentTab ? <RegisterForm /> : <LoginForm />;

        return <div>
            <DynamicTable className="header label centered" elems={header} rows="1" cols="2" colWidth={['50%', '50%']}/>
            <div className="login-app absolute-center centered">
                <DynamicTable className="toolbar centered" elems={tabs} rows="1" cols="2" colWidth={['50%', '50%']} />
                {form}
            </div>
        </div>
    }

    handleClick(i) {
        this.setState({
            currentTab: i
        });
    }
}

class ToolBarTab extends React.Component {
    render() {
        let tab = this.props.tab;
        let styleClass = (tab.selected ? "tab-selected " : "") + "label";
        return <div className={styleClass} onClick={tab.onclick}>
            {tab.name}
        </div>;
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().toLocaleString()
        };
        this.timerId = setInterval( () => this.setState( {time: new Date().toLocaleString()} ), +props.interval );
    }

    render() {
        return <div>Текущее время:<br/>{this.state.time}</div>;
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }
}

class MainApp extends React.Component {
    render() {
        let elems = [
            <div>Акатьев Никита Львович группа P3211<br/>Лабораторная №4</div>,
            <Timer interval="1000" />,
            <LogoutButton/>
        ];

        return <table style={{width: '100%'}}>
            <caption>
                <DynamicTable className="header label centered" elems={elems} rows="1" cols="3" colWidth={['40%', '40%', '20%']}/>
            </caption>
            <tbody><tr>
                <td style={{width: '50%'}}>
                    <CanvasComponent id={this.props.id} history={this.props.history.slice()} />
                </td>
                <td style={{width: '50%'}}>
                    <HistoryComponent history={this.props.history.slice()} />
                </td>
            </tr></tbody>
        </table>
    }
}

class LogoutButton extends React.Component {
    render() {
        return <input type="image" width="100" src="/img/logout.png" alt="Вернуться назад" onClick={this.handleClick}/>
    }

    handleClick() {
        ReactDOM.render(<LoginApp/>, document.getElementById('root'));
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
}

// todo put in different script file
(function() {
        let id = getCookie("user_id");
        if (id != null)
            fetch("http://localhost:14900/api/history/get/" + id)
                .then(res => res.text())
                .then(text => ReactDOM.render(
                        !text.length ? <LoginApp/> : <MainApp id={id} history={JSON.parse(text)} />,
                        document.getElementById("root")
                    )
                )
                .catch(error => console.log(error));
        else
            ReactDOM.render(<LoginApp/>, document.getElementById("root"));
})(); // todo remove package.json from git