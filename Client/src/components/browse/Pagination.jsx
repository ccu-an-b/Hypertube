import React from 'react'
import { Pagination } from 'antd';

export const PaginationComp = props => {
    return (
        <div className="data-pagination" >
            <Pagination 
                onChange={props.paginationHandle} 
                defaultCurrent={props.page} 
                current={props.page} 
                total={Math.ceil(props.pageCount / 50) * 10} 
            />
        </div>
    )
}