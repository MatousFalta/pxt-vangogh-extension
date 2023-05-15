

input.onButtonPressed(Button.A, () => {
    vanGogh.penDown();
    vanGogh.fd(50);
    vanGogh.penUp();
    vanGogh.fd(50, false);
    vanGogh.re(180);
    vanGogh.penDown();
    vanGogh.fd(50);
    vanGogh.penUp();
    vanGogh.fd(50, false);
})

input.onButtonPressed(Button.B, () => {
    vanGogh.penUp();
})

input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll()
    basic.clearScreen()
})

