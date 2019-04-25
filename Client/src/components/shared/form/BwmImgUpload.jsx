import React from 'react';
import { imgPath } from 'helpers';

export class BwmImgUpload extends React.Component {
    
    constructor(){
        super();

        this.setupReader()
        this.state = {
            selectedFile: undefined,
            imageBase64: '',
        }
    }

    setupReader(){
        this.reader = new FileReader();

        this.reader.addEventListener('load', (event) => {
            this.setState({imageBase64: event.target.result});
        });
    }
    
    onChange = event => {
    
        const selectedFile = event.target.files[0];
        if(selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png' || selectedFile.type=== 'image/jpg' || selectedFile.type === 'image/gif'))
        {
            if (selectedFile && /^[A-Z0-9._%+-]+\.[A-Z]+\.[A-Z]{2,4}$/i.test(selectedFile.name) === false ){
                this.setState({selectedFile});
                this.reader.readAsDataURL(selectedFile);
                this.onSuccess(selectedFile)
            }   
        }
    }

    onSuccess(uploadedImage){
        const {input: {onChange}} = this.props;
        onChange(uploadedImage);
    }
    
    render() {
        const {label, meta: {touched, error}, defaultValue} = this.props;
        const { imageBase64 } = this.state;

        return (
            <div className='img-upload-container'>
                <label className="img-upload btn btn-bwm" style={{'backgroundImage': `url("${process.env.PUBLIC_URL}/profile-placeholder.jpg")`}}>
                    <input  type='file'
                            value=''
                            accept='.jpg, .png, .jpeg, .gif'
                            onChange={this.onChange}
                            ref={input => this.inputUpload = input} />
                </label>
                <h4 onClick={() => this.inputUpload.click()} >{label}</h4>
                { touched &&
                    ((error && <div className='alert alert-danger'>{error}</div>))
                }

                { imageBase64 &&
                    <div className='img-preview-container' onClick={() => this.inputUpload.click()}>
                        <div className='img-preview' style={{'backgroundImage' : 'url(' + imageBase64 + ')'}}>
                        </div>
                    </div>
                }
                {defaultValue && !imageBase64 &&
                    <div className='img-preview-container' onClick={() => this.inputUpload.click()}>
                        <div className='img-preview' style={{'backgroundImage' : 'url(' + imgPath(defaultValue) + ')'}}>
                        </div>
                    </div>
                }
            </div>
        )
    }
} 