import React from 'react'

export class EditableInput extends React.Component {
    constructor(){
        super();
        this.state = {
            isActive: false,
            value:undefined,
            originValue:undefined,
        };
    }  
  
    componentDidMount(){
        const { entity, entityField} = this.props;
        const value = entity[entityField];

        this.setState({
            value,
            originValue: value,
        });
    }

    disableEdit() {
        this.setState({isActive: false})
    }

    enableEdit() {
        this.setState({isActive: true})
    } 

    update = async () =>{
        const {value, originValue} = this.state;
        const {updateEntity, entityField} = this.props;
        if (value !=="" && value !==originValue){
            const valid = await updateEntity({[entityField]: value});
            if (valid)
                this.setState({isActive: false, originValue: value});
            else
                this.setState({isActive: false, value: originValue});
        }
        else
            this.setState({isActive: false, value: originValue});
    }

    renderComponentView(){
        const { value, isActive, placeholder } = this.state;
        const { className } = this.props;

        if (isActive){
            return(
                <div className='form-group editable'>
                    <div className='input-group'>
                        <input className="form-control" onChange={(e) => this.handleChange(e)} value={value} placeholder={placeholder} />
                        <button className='btn' type="button" onClick={() => this.update()}>Save</button>
                        <i className="fas fa-times" onClick={() => this.disableEdit()}></i>
                    </div>
                </div>
            )
        }
        return(
            <div className="non-active-form">
                <p className={className}>{value}</p>
                <i className="fas fa-pen" onClick={() => this.enableEdit()}></i>
            </div>
        )
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }

    render() {
        return (
            <div>
                {this.renderComponentView()}
            </div>
        )
  }
}
