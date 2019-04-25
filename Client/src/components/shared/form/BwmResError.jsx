import React from 'react';

export function BwmResError(props) {
    const errors = props.errors
        return (
            errors.length > 0 &&
                <div className='alert  alert-danger-hypertube'>
                    {errors.map((error, index) => <p key={index}>{error.result || error}</p>)}
                </div>

        )
}