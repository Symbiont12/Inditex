import React from 'react';
import cssLoading from './Loading.scss';

const Loading = ()=>{

    return (
        <div className={[cssLoading.velo, cssLoading.loading].join(' ')}>
            <div className={cssLoading.loaderp}/>
            <span className={cssLoading.message}> CARGANDO </span>
            <span className={cssLoading.messageBottom}> Un momento...Espere por favor. </span>
        </div>
    )
      
}
export default Loading