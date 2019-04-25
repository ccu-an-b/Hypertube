import React from 'react';
import {EditableInput} from 'components/shared/editable/EditableInput';
import { BwmResError } from 'components/shared/form/BwmResError';

export default class GeneralForm extends React.Component {
  render() {
    const { user, errors, update } = this.props;

    return (
      <div className='form my-form'>
        <BwmResError errors={errors} />     
        <EditableInput  entity={user} 
                        entityField={'login'} 
                        updateEntity={update} 
                        placeholder={'Login'} />
        <EditableInput  entity={user} 
                        entityField={'firstname'} 
                        updateEntity={update} 
                        placeholder={'First Name'} 
                        className={'capitalize'}/>
        <EditableInput  entity={user} 
                        entityField={'lastname'} 
                        updateEntity={update} 
                        placeholder={'Last Name'} 
                        className={'capitalize'}/>
        <EditableInput  entity={user} 
                        entityField={'email'} 
                        updateEntity={update} 
                        placeholder={'Mail'}/> 
      </div>
    )
  }
}

