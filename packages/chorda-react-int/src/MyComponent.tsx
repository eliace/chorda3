import React from 'react'

export default (props) => {

    const {rootProps, buttonProps, text: MyText} = props

    const [data] = React.useState(5)

    /* тут ничего не меняется */
    const handleClick = () => {

    }

    return <div {...rootProps} >
        <button onClick={handleClick} {...buttonProps} >Click me</button>
        <MyText>{data}</MyText>
    </div>
}
