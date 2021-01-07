import React , { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { connect } from 'react-redux'
import { getProfileById } from '../../actions/profile'



const Profile = ({ match, profile: {profile, loading}, auth }) => {
    useEffect(() => {
     
       getProfileById(match.params.id)

    }, [ getProfileById ]);
    return (
        <div>
            profile
        </div>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps =  state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps,{ getProfileById })(Profile)
