import '../../styles/spinner.css'

export function Load_Spinner({wrapStyle}) {
    return (
    <div className="spinner-wrapper" style={wrapStyle}>
        <img className="spinner" src="/public/images/spin.svg" alt="" />
    </div>
)
}