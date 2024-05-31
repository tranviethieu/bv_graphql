import React, {Component} from 'react';
import {Button, InputAdornment, Icon} from '@material-ui/core';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as authActions from 'app/auth/store/actions';

class ElsagaLoginTab extends Component {

    state = {
        canSubmit: false
    };

    form = React.createRef();

    disableButton = () => {
        this.setState({canSubmit: false});
    };

    enableButton = () => {
        this.setState({canSubmit: true});
    };

    onSubmit = (model) => {
      console.log(model)
        this.props.submitLogin(model);
    };

    componentDidUpdate(prevProps, prevState)
    {
        if ( this.props.login.error && (this.props.login.error.email || this.props.login.error.password) )
        {
            this.form.updateInputsWithError({
                ...this.props.login.error
            });

            this.props.login.error = null;
            this.disableButton();
        } else if(this.props.login.success) {
            // console.log("login successed with datalogin:",this.props.login,this.props.user);
            this.props.history.push("/")
        }

        return null;
    }

    render()
    {
        const {canSubmit} = this.state;

        return (
            <div className="w-full el-ElsagaLoginTab">
              <Formsy
                onValidSubmit={this.onSubmit}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                ref={(form) => this.form = form}
                className="flex flex-col justify-center w-full"
              >
                <TextFieldFormsy
                  className="mb-16"
                  type="text"
                  name="email"
                  label="Tên đăng nhập"
                  validations={{
                    minLength: 4
                  }}
                  validationErrors={{
                    minLength: 'Tên đăng nhập ít nhất phải chứa 4 ký tự'
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person_outline</Icon></InputAdornment>
                  }}
                  variant="outlined"
                  required
                />

                <TextFieldFormsy
                  className="mb-16"
                  type="password"
                  name="password"
                  label="Mật khẩu"
                  validations={{
                    minLength: 4
                  }}
                  validationErrors={{
                    minLength: 'Mật khẩu ít nhất phải chứa 4 ký tự'
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                  }}
                  variant="outlined"
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto mt-16 normal-case"
                  aria-label="LOG IN"
                  disabled={!canSubmit}
                  value="legacy"
                >
                  Đăng nhập
                </Button>

              </Formsy>

            </div>
        );
    }
}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        submitLogin: authActions.submitLogin
    }, dispatch);
}

function mapStateToProps({auth})
{
    return {
        login: auth.login,
        user : auth.user
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ElsagaLoginTab));
