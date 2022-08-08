import random
import socket

def restaurant_chooser(num):
    """
    Chooses a restaurant from a range between 1 and the received value, 'number'
    """
    restaurant = random.randint(1, num)
    return restaurant


# host and port settings
host = 'localhost'
port = 1300

# create a socket at client side
# using TCP / IP protocol
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((host, port))
    s.listen()
    while True:
        clientsocket, address = s.accept()
        print('connected')
        try:
            msg = clientsocket.recv(1024)
            if msg != b'':
                print('number of restaurants', msg)
                res_num = int(msg.decode())
                number = str(restaurant_chooser(res_num))
                clientsocket.sendall(number.encode(encoding='UTF-8', errors='strict'))
                print("Restaurant choice successfully returned to client!")
        except ValueError:
            pass