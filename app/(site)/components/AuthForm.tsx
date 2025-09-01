'use client';

import axios from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';

import { BsGithub, BsGoogle } from 'react-icons/bs';

import Input from '@/app/components/ui/inputs/Input';
import Button from '@/app/components/ui/button/Button';
import AuthSocialButton from './AuthSocialButton';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
            axios.post('/api/register', data)
                .then(() => {
                    signIn('credentials', {
                        ...data,
                        redirect: false,
                    })
                        .then((callback) => {
                            if (callback?.ok && !callback?.error) {
                                toast.success('حساب کاربری ایجاد شد و وارد شدید!');
                                router.push('/users');
                            }
                            if (callback?.error) {
                                toast.error(callback.error);
                            }
                        });
                })
                .catch(() => toast.error('ثبت‌نام ناموفق بود!'))
                .finally(() => setIsLoading(false));
        }

        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('اطلاعات کاربری نامعتبر است');
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success('با موفقیت وارد شدید');
                        router.push('/users');
                    }
                })
                .finally(() => setIsLoading(false));
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error(`خطا: ${callback.error}`);
                }
                if (callback?.ok && !callback?.error) {
                    router.push('/users');
                    toast.success('با موفقیت وارد شدید');
                }
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} >
                        {variant === "REGISTER" && (
                            <Input id="name" label="نام"
                                register={register} errors={errors} disabled={isLoading} />
                        )}
                        <Input id="email" label="ایمیل"
                            register={register} errors={errors} disabled={isLoading} />
                        <Input id="password" label="رمز عبور"
                            register={register} errors={errors} disabled={isLoading} />

                        <div className="mt-6">
                            <Button disabled={isLoading} fullWidth type="submit">
                                {variant === "LOGIN" ? "ورود" : "ثبت‌نام"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500 font-bold">
                                    یا
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                        {variant === 'LOGIN' ? 'در مسنجر ما عضو نیستید؟' : 'قبلاً حساب کاربری دارید؟'}
                        <div onClick={toggleVariant} className="underline cursor-pointer">
                            {variant === 'LOGIN' ? 'ساخت حساب کاربری' : 'ورود'}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};