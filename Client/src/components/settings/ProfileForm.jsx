import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmImgUpload } from 'components/shared/form/BwmImgUpload';
import { required } from 'components/shared/form/validators';

const Text = require('../../helpers/languages');

let ProfileForm = props => {
    const { handleSubmit, pristine, submitting, submitCb, valid, errors, defaultValue, success, user} = props
    return (
        <form className='form my-form' onSubmit={handleSubmit(submitCb)}>
            <BwmResError errors={errors } />      
                <Field
                    name="img"
                    label={Text.changePicture[user.language]}
                    defaultValue={defaultValue}
                    validate={[required]}
                    component={BwmImgUpload}
                />
                <div className="form-submit">
                    <button className='btn button full' type="submit" disabled={!valid || pristine || submitting || success }>
                        {Text.savePicture[user.language]}
                    </button>
                </div>                         
        </form>
    )
}
export default reduxForm({
    form: 'profileForm'
})(ProfileForm)
