# Monty hall simulator
# Het monty hall probleem is een probleem uit een tv spel show.
# De kandidaat krijgt 3 deuren om uit te kiezen, achter 1 van de deuren zit een prijs, achter de andere 2 niet.
# Als de kandidaat een deur heeft gekozen, dan opent de presentator een deur waar geen prijs achter zit (niet de deur die de kandidaat heeft gekozen).
# Daarna krijgt de kandidaat de keus om bij zijn originele deur te blijven of om te wisselen naar de laatste deur.
# Op het moment staat de simulator ingesteld om 1000 rondes te simuleren waarbij de kandidaat niet wisselt van deur als hij daartoe de kans krijgt, alle andere keuzes zijn willekeurig.
# Hoe vaak uit deze 1000 denk je dat de kandidaat de prijs wint?
from random import randint


class monty():
    pickedDoor = None
    disabledDoor = None

    def __init__(self, switch=False):
        self.winningDoor = randint(0, 2)
        self.doors = [0, 0, 0]
        self.switch = switch
        self.greeting = "hai"

    def pickRandDoor(self):
        self.pickedDoor = randint(0, 2)

    def removeDoor(self):
        done = False
        while done == False:
            num = randint(0, 2)
            if num == self.pickedDoor or num == self.winningDoor:
                continue
            self.disabledDoor = num
            done = True

    def result(self):
        if self.winningDoor == self.pickedDoor:
            return not self.switch
        else:
            return self.switch

# Gebruikt tijdens debuggen
    def __repr__(self):
        doors = self.doors
        if not self.pickedDoor == None:
            doors[self.pickedDoor] = "P"
        if not self.disabledDoor == None:
            doors[self.disabledDoor] = "D"
        return str(doors)

# Ik ging uitzoeken hoe object properties werken, heeft verder niets met de simulator te maken.
    @property
    def hello(self):
        print("Getter called")
        return self.greeting

    @hello.setter
    def hello(self, value):
        print("Setter called")
        self.greeting = value

    @hello.deleter
    def hello(self):
        print("Deleter called")
        del self.greeting


def testProperty():
    greeter = monty()
    print(greeter.hello)
    greeter.hello = "Hello"
    print(greeter.hello)
    del greeter.hello
    greeter.hello = 'what happens now?'


results = []
numOfTests = 1000
switchDoors = False
Wins = 0

if __name__ == "__main__":
    testProperty()
    print("Simulating "+str(numOfTests)+" monty hall games.")
    for i in range(numOfTests):
        test = monty(switch=switchDoors)
        test.pickRandDoor()
        test.removeDoor()
        results.append(test.result())
    for result in results:
        if result == True:
            Wins += 1
    print(Wins)
