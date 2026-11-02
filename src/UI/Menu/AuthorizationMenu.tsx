import { createSignal } from "solid-js";
import { loginUser, registerUser } from "../../utils/auth";

import Input from "../Component/Input";
import Modal from "../Component/Modal";
import Button from "../Component/Button";
import { Transition } from "../Component/Transition";

const AuthorizationMenu = (props: any) => {
  const [name, setName] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError("");

    const res = await loginUser(name(), password());
    console.log(res);
    if (!res.success) setError(res.error || "Ошибка входа");
  };

  const handleRegister = async () => {
    setError("");

    const res = await registerUser(name(), password());
    console.log(res);
    if (!res.success) setError(res.error || "Ошибка регистрации");
  };

  return (
    <Modal title="Авторизация" noClose {...props}>
      <form class="Authorization" onSubmit={handleLogin}>
        <Transition isOpen={Boolean(error())}>
          <div class="auth-error">{error()}</div>
        </Transition>

        <Input value={name()} placeholder="Логин" onInput={(val) => setName(val)} />
        <Input value={password()} placeholder="Пароль" onInput={(val) => setPassword(val)} />

        <div class="auth-buttons">
          <Button class="Item cn" type="submit">
            Вход
          </Button>

          <Button class="Item cn" type="button" onClick={handleRegister}>
            Регистрация
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthorizationMenu;
