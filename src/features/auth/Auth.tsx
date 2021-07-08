import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { User } from "../../interfaces/user.interface";
import http from "../../services/api";
import { AuthResponse } from "../../services/mirage/routes/user";
import { useAppDispatch } from "../../store";
import { saveToken, setAuthState } from "./authSlice";
import { setUser } from "./userSlice";

const schema = Yup.object().shape({
  username: Yup.string()
    .required("What? No username?")
    .max(16, "Username cannot be longer than 16 characters"),
  password: Yup.string().required("Without a password, none shall pass!"),
  email: Yup.string().email("Please provide a valid email address (abc@xy.z"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({
    context: schema,
  });

  const submitForm = (data: User) => {
    const path = isLogin ? "/auth/login" : "/auth/signup";
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;

          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth">
      <div className="card">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="inputWrapper">
            <input {...register("username")} placeholder="Username" />
            {errors && errors.username && (
              <p className="error">{errors.username.message}</p>
            )}
          </div>
          <div className="inputWrapper">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <div className="inputWrapper">
              <input {...register("email")} placeholder="Email (optional)" />
              {errors && errors.email && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>
          )}

          <div className="inputWrapper">
            <button type="submit" disabled={isLoading}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          </div>

          <p
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: "pointer", opacity: 0.7 }}
          >
            {isLogin ? "No account? Create one" : "Already have an account?"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
