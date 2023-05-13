

input.onButtonPressed(Button.A, () => {
    vanGogh.penDown();
})

input.onButtonPressed(Button.B, () => {
    vanGogh.penUp();
})

input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll()
    basic.clearScreen()
})

