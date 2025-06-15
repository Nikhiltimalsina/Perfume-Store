function Addition(props){
    const sum = props.a + props.b;
    return(
        <>
        <p>
            The sum of {props.a} and {props.b} is {sum}
        </p>
        </>
    );
}
export default Addition