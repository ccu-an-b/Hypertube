import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required, minLength8,checkNumber, checkUpper, checkLetter,  maxLength128 } from 'components/shared/form/validators';

const Text = require('../../helpers/languages');

const PasswordForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success, user} = props
    return (
        <form className='form my-form' onSubmit={handleSubmit(submitCb)}>
            <BwmResError errors={errors} />     
            <BwmResSuccess success={success} />   
            <Field
                name="currentPassword"
                type="password"
                placeholder={Text.placeholderOldPassword[user.language]}
                className='form-control'
                component={BwmInput}
                validate={[required, minLength8, checkNumber,checkLetter, checkUpper, maxLength128]}
            />
            <Field
                name="password"
                type="password"
                placeholder={Text.placeholderNewPassword[user.language]}
                className='form-control'
                component={BwmInput}
                validate={[required, minLength8, checkNumber,checkLetter, checkUpper, maxLength128]}
            />
            <div className="form-submit right">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    {Text.savePassword[user.language]}
                </button>
            </div>                         
        </form>
    )
}

export default reduxForm({
    form: 'passwordForm'
})(PasswordForm)