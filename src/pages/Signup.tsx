import React from 'react';
import Layout from '../components/Layout';
import SignupForm from '../components/auth/SignupForm';

const Signup: React.FC = () => {
    return (
        <Layout>
            <div className="max-w-md mx-auto mt-12 px-4 sm:px-0">
                <SignupForm />
            </div>
        </Layout>
    );
};

export default Signup;
