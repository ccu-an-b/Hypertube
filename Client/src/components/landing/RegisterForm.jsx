import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { BwmImgUpload } from 'components/shared/form/BwmImgUpload';
import { required, isEmail, minLength8,minLength5, checkNumber, checkUpper, checkLetter, checkSpecialChar, maxLength128 } from 'components/shared/form/validators';


const RegisterForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success, switchModal} = props
    return (
        <form className='form my-form' onSubmit={handleSubmit((submitCb))}>
            <div className="my-modal-header">
                <h2>Sign Up</h2>
            </div>
            <BwmResError errors={errors}/>
            <BwmResSuccess success={success} />      
            <Field
                name="firstname"
                type="text"
                placeholder="Name"
                className='form-control'
                component={BwmInput}
                validate={[required, maxLength128]}
                data-parse='lowercase'
            />
            <Field
                name="lastname"
                type="text"
                placeholder="Last Name"
                className='form-control'
                component={BwmInput}
                validate={[required, maxLength128]}
                data-parse='lowercase'
            />
            <Field
                name="email"
                type="text"
                placeholder="Email"
                className='form-control'
                component={BwmInput}
                validate={[required, isEmail, maxLength128]}
                data-parse='lowercase'
            />
            <Field
                name="login"
                type="text"
                placeholder="Username"
                className='form-control'
                component={BwmInput}
                validate={[required, checkSpecialChar, minLength5, maxLength128]}
                data-parse='lowercase'
            />
            <Field
                name="password"
                type="password"
                placeholder="Password"
                className='form-control'
                component={BwmInput}
                validate={[required, minLength8, checkNumber,checkLetter, checkUpper, maxLength128]}
            />
             <Field
                name="img"
                label="Add a profile picture"
                defaultValue=""
                validate={[required]}
                component={BwmImgUpload}
            />

            <div className="form-submit">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    Sign Up
                </button>
            </div>
            <h5  onClick={() => switchModal('sign-in')}>Already have an account ?</h5>
        </form>
    )
}

export default reduxForm({
    form: 'registerForm'
})(RegisterForm)