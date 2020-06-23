import React from 'react';

//spinning load icon while waiting for server
export const Loading = () => {
    return (
        <div className="col">
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary" />
            <p>Loading...</p>
        </div>
    );
};