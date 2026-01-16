import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError } from '../../store/authSlice';
import { supabase } from '../../utils/supabase';
import type { RootState } from '../../store';

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
}).required();

type SignupFormInputs = yup.InferType<typeof schema>;

const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: SignupFormInputs) => {
        setIsSubmitting(true);
        dispatch(setError(null));
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                dispatch(setUser(authData.user));
                alert('Signup successful! Please check your email for verification if enabled in Supabase, or try logging in.');
                navigate('/login');
            }
        } catch (err: any) {
            dispatch(setError(err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-white/50">Join LuxStay for the best hospitality deals</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            {...register('email')}
                            type="email"
                            className={`w-full h-12 pl-12 pr-4 bg-black/20 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            {...register('password')}
                            type="password"
                            className={`w-full h-12 pl-12 pr-4 bg-black/20 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            {...register('confirmPassword')}
                            type="password"
                            className={`w-full h-12 pl-12 pr-4 bg-black/20 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/40">
                Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
            </div>
        </motion.div>
    );
};

export default SignupForm;
