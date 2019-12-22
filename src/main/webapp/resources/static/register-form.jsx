class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        console.log('constructor');
        this.state = {
            login: '',
            password: '',
            passwordAgain: '',
            message: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return <div className="label">
            <div className="message">{this.state.message}</div>
            <form name="login-form" onSubmit={this.handleSubmit}>
                <label>
                    Логин:<br/>
                    <input type="text" className="textfield" name="login" value={this.state.login} onChange={this.handleChange}/>
                </label>
                <br/><br/>
                <label>
                    Пароль:<br/>
                    <input type="password" className="textfield" name="password" value={this.state.password} onChange={this.handleChange}/>
                </label>
                <br/><br/>
                <label>
                    Пароль еще раз:<br/>
                    <input type="password" className="textfield" name="passwordAgain" value={this.state.passwordAgain} onChange={this.handleChange}/>
                </label>
                <br/><br/>
                <input type="submit" className="button" value="Регистрация"/>
            </form>
        </div>
    }

    handleChange(event) {
        let state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.login === '' || this.state.password === '') { // todo minimize
            this.setState({
                login: this.state.login,
                password: '',
                message: 'Заполните все необходимые поля.'
            });
            return;
        }

        if (this.state.password !== this.state.passwordAgain) {
            this.setState({
                login: this.state.login,
                password: '',
                passwordAgain: '',
                message: 'Пароли различаются.'
            });
            return;
        }

        let id = -2;
        let message = '';
        fetch(`http://localhost:14900/api/user/register?userName=${this.state.login}&password=${this.state.password}`)
            .then(
                res => id = res,
                error => {
                    message = 'Ошибка обмена данных с сервером.';
                    console.log(error);
                }
            ); // todo promises are async! do something with it

        console.log(id);

        if (id === -1) message = 'Данный пользователь уже существует.';
        if (id === 0) message = 'Введите пароль.';

        if (id <= 0) {
            this.setState({
                login: this.state.login,
                password: '',
                message: message
            });
            return;
        }

        document.cookie = 'user_id=' + id;
        ReactDOM.render(<MainApp id={id} history={'{}'} />, document.getElementById('root'));
    }
}