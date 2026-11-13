# Aplica la revisión del español aprobada por Jorge (docs/revision/revision-espanol.md, «todo»)
# a los niveles 5 a 20: guion.json, el documento del guion y los pedazos en español de trans_lN.py.
# Cada cambio es (nivel, texto viejo, texto nuevo) y tiene que existir; si no, se avisa.
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
DOCS = [os.path.join(APP, 'docs', f) for f in ('guion-v3-niveles-5-12.md', 'guion-v4-niveles-13-20.md')]

R = {
 5: [
  ('eso es un hit, en inglés hit.', 'eso es un hit.'),
  ('tu base es tu casa segura, en inglés safe:', 'tu base es tu lugar seguro, en inglés safe:'),
  ('¡Bien! Tu casa segura.', '¡Bien! Tu lugar seguro.'),
  ('Toca la base que es tu casa segura al llegar de un hit cortito', 'Toca la base que es tu lugar seguro al llegar de un hit cortito'),
  ('Un hit se nombra por las bases que llegas.', 'Un hit se nombra según la base a la que llegas.'),
  ('La bola pegó lejos en los jardines', 'La bola cayó lejos en los jardines'),
  ('¡triple, triple!', '¡triple!'),
  ('La bola sale del campo en el aire, por zona buena.', 'La bola sale del campo en el aire, por territorio fair.'),
  ('(la bola sale del campo en el aire por zona buena: vuelta completa)', '(la bola sale del campo en el aire por territorio fair: vuelta completa)'),
  ('si la bola buena pica y luego sale del campo', 'si la bola pica en territorio fair y luego sale del campo'),
  ('La bola sale volando del campo, por zona buena, sin tocar el suelo', 'La bola sale volando del campo, por territorio fair, sin tocar el suelo'),
  ('si la bola pica en el campo bueno y DESPUÉS salta fuera', 'si la bola pica en territorio fair y DESPUÉS salta fuera'),
 ],
 6: [
  ('Sin fuerza, hay que tocar al corredor.', 'Si no está forzado, hay que tocar al corredor.'),
  ('No, su base es su casa segura', 'No, su base es su lugar seguro'),
  ('En su casa segura no hay out.', 'En su lugar seguro no hay out.'),
  ('Toca a quién hay que tocar con la bola', 'Señala al corredor que hay que tocar con la bola'),
  ('Fuera de su casa segura y tocado: out.', 'Fuera de su lugar seguro y tocado: out.'),
  ('su base es su casa segura. Si está parado', 'su base es su lugar seguro. Si está parado'),
  ('Sin nadie en primera, no hay fuerza en segunda.', 'Sin nadie en primera, el de segunda no está forzado.'),
  ('Para decidir si hay fuerza, hay que mirar si la base de atrás está ocupada', 'Para saber si un corredor está forzado, hay que mirar si la base de atrás está ocupada'),
  ('¡Safe! No había fuerza', '¡Safe! No estaba forzado'),
  ('Sin fuerza, pisar la base no sirve.', 'Si no está forzado, pisar la base no sirve.'),
  ('¡Bien! Sin fuerza no hay receta.', '¡Bien! Sin corredor forzado no hay receta.'),
  ('Verdadero: el doble play nace de la fuerza.', 'Verdadero: el doble play nace del corredor forzado.'),
  ('Verdadero o falso: da igual atraparla con el guante o que rebote primero en el guante y caiga al suelo', 'Verdadero o falso: si la bola te rebota en el guante y cae al suelo, igual es out'),
 ],
 7: [
  ('Safe en la base: tu casa segura', 'Safe en la base: tu lugar seguro'),
  ('No, es mi casa segura', 'No, es mi lugar seguro'),
  ('Falso: la casa es para uno.', 'Falso: la base es para uno solo.'),
  ('El de atrás no tenía casa ahí.', 'El de atrás no tenía lugar ahí.'),
  ('Toca la casa segura del corredor que está en tercera', 'Toca el lugar seguro del corredor que está en tercera'),
  ('¡Bien! Esa es su casa.', '¡Bien! Esa es su base.'),
  ('Out: saliste de tu casa segura', 'Out: saliste de tu lugar seguro'),
  ('¡Correcto! Fuera de la casa hay peligro.', '¡Correcto! Fuera de la base hay peligro.'),
  ('Tu base es tu casa segura.', 'Tu base es tu lugar seguro.'),
  ('Pero la casa es para uno solo', 'Pero la base es para uno solo'),
  ('dueño de esa casa', 'dueño de esa base'),
  ('y recién entonces puede correr', 'y solo entonces puede correr'),
  ('si la bola buena te toca', 'si la bola bateada en territorio fair te toca'),
  ('si una bola bateada en zona buena toca', 'si una bola bateada en territorio fair toca'),
  ('¿A qué defensor NO cuenta como «ya pasó» si la bola lo pasa?', 'Si la bola solo pasó junto a este defensor, la excepción NO vale. ¿Quién es?'),
  ('"Al pitcher"', '"El pitcher"'),
  ('"Al campocorto"', '"El campocorto"'),
  ('"Al segunda base"', '"El segunda base"'),
  ('los corredores son una fila, no se adelanta.', 'los corredores son una fila: nadie se adelanta.'),
  ('La fila no se adelanta: out el que pasa.', 'En la fila nadie se adelanta: out el que pasa.'),
  ('Toca la casa segura de un corredor en primera', 'Toca el lugar seguro de un corredor en primera'),
  ('¿Cómo se dice «a salvo» en este nivel?', '¿Cómo se dice «a salvo» en inglés?'),
 ],
 8: [
  ('casi seguro lanzará su mejor bola por la zona', 'casi seguro tirará su mejor lanzamiento por la zona'),
  ('Ventaja del bateador: viene bola por la zona.', 'Ventaja del bateador: viene un lanzamiento por la zona.'),
  ('viene bola rápida por la zona', 'viene una recta por la zona'),
  ('¡Eso es! E de errors.', '¡Eso es! E de errores.'),
  ('¿Cómo se dice error en inglés?', '¿Cómo se dice «carreras» en inglés?'),
  ('Toca al jugador cuya falla fácil convierte el batazo en error', 'Toca al defensor que falló la jugada fácil'),
 ],
 9: [
  ('Llegaste a segunda antes del toque del defensor.', 'Llegaste a segunda antes de que el defensor te tocara con la bola.'),
  ('¡Correcto! De vuelta a tu casa segura.', '¡Correcto! De vuelta a tu lugar seguro.'),
  ('Despegado vives entre dos bases, sin casa.', 'Despegado estás entre dos bases, sin lugar seguro.'),
  ('quedaste fuera de tu casa segura', 'quedaste fuera de tu lugar seguro'),
  ('El pitcher defiende su base con ese tiro.', 'Con ese tiro el pitcher vigila al corredor.'),
  ('si vuelves a tu base antes del toque, eres safe', 'si vuelves a tu base antes de que te toquen, eres safe'),
  ('¡Bien! Tu casa segura te salva.', '¡Bien! Tu lugar seguro te salva.'),
  ('Tocado fuera de tu casa: out.', 'Tocado fuera de tu base: out.'),
  ('un tiro para sorprenderte fuera de tu casa.', 'un tiro para sorprenderte fuera de tu base.'),
  ('cometió un balk, en inglés balk.', 'cometió un balk.'),
  ('Verdadero: sin corredores, ese movimiento no castiga así.', 'Verdadero: sin corredores, ese movimiento no se castiga como balk.'),
  ('si te atrapa el tiro antes de llegar', 'si el tiro llega y te tocan antes de que llegues'),
  ('¿Qué canta el umpire si el toque llega antes que tú?', '¿Qué canta el umpire si te tocan con la bola antes de llegar?'),
 ],
 10: [
  ('¡Correcto! Muchas ligas chicas no la usan.', '¡Correcto! Muchas ligas de niños pequeños no la usan.'),
  ('El corredor pisó mal y pasó de largo segunda en su camino.', 'El corredor se saltó segunda sin pisarla.'),
 ],
 11: [
  ('tu lanzamiento derecho y con control', 'tu lanzamiento recto y con control'),
  ('"La casa segura"', '"El lugar seguro"'),
 ],
 12: [
  ('eso separa al jugador del All Star.', 'eso separa a un jugador cualquiera de un All Star.'),
  ('Recibe el tiro del jardinero y lo releva a la base que haga falta', 'Recibe el tiro del jardinero y lo pasa a la base que haga falta'),
  ('¡Correcto! Recibe y releva.', '¡Correcto! Recibe y pasa.'),
  ('El cuadro releva a los jardines.', 'El cuadro ayuda a los jardines con el tiro.'),
  ('recibe el tiro y lo releva rápido', 'recibe el tiro y lo pasa rápido'),
  ('ocupar la casa que quedó vacía', 'ocupar la base que quedó vacía'),
 ],
 14: [
  ('ponte frente a la bola, en inglés field the ball.', 'ponte frente a la bola y fíldeala, en inglés field the ball.'),
  ('Tu cuerpo detrás de la bola la detiene todo.', 'Con tu cuerpo detrás de la bola, nada se escapa.'),
  ('y recién ahí busca el siguiente tiro', 'y solo entonces busca el siguiente tiro'),
 ],
 15: [
  ('Atrapada de verdad o trampa', 'Atrapada de verdad o bola de pique'),
  ('Una trampa (trap): no es atrapada', 'Una bola de pique (trap): no es atrapada'),
  ('¡Correcto! Trampa.', '¡Correcto! De pique.'),
  ('Con una trampa, el bateador es out igual', 'Con una bola de pique, el bateador es out igual'),
  ('Si hay trampa, ¿qué debe hacer el jardinero?', 'Si la bola fue de pique, ¿qué debe hacer el jardinero?'),
  ('Falso: un solo toque al suelo y ya es trampa.', 'Falso: si toca el suelo una sola vez, ya es de pique.'),
  ('de la trampa (la bola toca el suelo antes o a la vez)', 'de la bola de pique (la bola toca el suelo antes o a la vez)'),
  ('es una trampa, en inglés trap, y no es atrapada', 'es una bola de pique, en inglés trap, y no es atrapada'),
  ('Tras una trampa, la bola sigue viva.', 'Tras un pique así, la bola sigue viva.'),
 ],
 16: [
  ('Caja, postura y agarre, en inglés stance y grip.', 'Postura y agarre: en inglés, stance y grip.'),
  ('Eso es un foul tip, en inglés foul tip.', 'Eso es un foul tip.'),
  ('Donde el bateador se sienta famoso', 'Fuera de la caja, donde quiera'),
 ],
 17: [
  ('Como piezas de ajedrez, dice el guion.', 'Mueve a sus jugadores como piezas de ajedrez.'),
  ('eso es un walk-off, en inglés walk-off:', 'eso es un walk-off:'),
  ('Verdadero: el visitante siempre deja un turno de respuesta.', 'Verdadero: el de casa siempre tiene su turno para responder.'),
 ],
 18: [
  ('es tirarse por el suelo para llegar bajo el toque.', 'es tirarse por el suelo para llegar por debajo del guante del defensor.'),
  ('Deslizarse sirve para llegar bajo el toque del defensor', 'Deslizarse sirve para llegar por debajo del guante del defensor'),
  ('Lo que pide la liga, no un número de aquí.', 'Lo define tu liga: pregúntale a tu coach.'),
  ('Este documento con un número fijo', 'Un número fijo igual para todas las ligas'),
  ('Este documento lo prohíbe en todas', 'Está prohibido en todas las ligas'),
 ],
 20: [
  ('la cuenta llena te aprieta', 'el conteo completo te aprieta'),
  ('/ cuarto malo fuera /', '/ cuarta bola fuera de la zona /'),
  ('cuarto malo a bola-base por bolas', 'cuarta bola a base por bolas'),
  ('La base de Todo está sólida.', 'La base de todo está sólida.'),
  ('¡Bien! Fuerza es pisar.', '¡Bien! Forzado es pisar.'),
  ('el out forzado se hace pisando la base y el de toque, tocando al corredor', 'el out forzado se hace pisando la base y el otro, tocando al corredor con la bola'),
  ('outs forzado y de toque', 'outs forzado y por tocado'),
  ('REPASO: toca la primera base del camino clásico del doble play que termina en primera', 'REPASO: toca la base donde se hace el primer out del doble play clásico'),
  ('REPASO: la bola buena pica y salta la valla.', 'REPASO: la bola pica en territorio fair y salta la valla.'),
  ('te dio una carrera inesperada a primera', 'te dio una corrida inesperada a primera'),
  ('¡Bien! Esa carrera es legal.', '¡Bien! Correr a primera ahí es legal.'),
  ('la secuencia de recta y cambio que piensa antes de lanzar', 'el pitcher que piensa su recta y su cambio antes de lanzar'),
  ('La C se sostiene con actos.', 'La C de capitán se gana con actos.'),
  ('Mira el camino que caminaste:', 'Mira todo el camino que recorriste:'),
 ],
}
# Preguntas de examen que se cambian enteras (A3: «¿cómo se dice X en inglés?» cuando X es igual).
EXAM = {
 (5, 12): {'q': '¿Cómo se dice «sencillo» en inglés?', 'opts': ['Single', 'Balk', 'Lead'], 'correct': 'Single'},
 (8, 3): {'q': '¿Cómo se dice «carreras» en inglés?', 'opts': ['Runs', 'Strikes', 'Lead'], 'correct': 'Runs'},
}

missing = []
g = json.load(open(os.path.join(HERE, 'guion.json')))

def sub_all(o, old, new, counter):
    if isinstance(o, dict):
        return {k: sub_all(v, old, new, counter) for k, v in o.items()}
    if isinstance(o, list):
        return [sub_all(v, old, new, counter) for v in o]
    if isinstance(o, str) and old.strip('"') in o:
        o2 = o.replace(old.strip('"'), new.strip('"')) if not old.startswith('"') else (new.strip('"') if o == old.strip('"') else o)
        if o2 != o:
            counter[0] += 1
        return o2
    return o

for lv, pairs in R.items():
    for old, new in pairs:
        c = [0]
        g[str(lv)] = sub_all(g[str(lv)], old, new, c)
        if not c[0]:
            missing.append(f'guion L{lv}: {old}')
for (lv, n), e in EXAM.items():
    ex = [x for x in g[str(lv)]['exam'] if x['n'] == n][0]
    ex.update(e)
json.dump(g, open(os.path.join(HERE, 'guion.json'), 'w'), ensure_ascii=False, indent=1)

# Documento del guion y pedazos en español de las traducciones.
for path in DOCS + [os.path.join(HERE, f'trans_l{n}.py') for n in range(5, 21)]:
    s = open(path).read()
    s0 = s
    for lv, pairs in R.items():
        if 'trans_l' in path and not path.endswith(f'trans_l{lv}.py'):
            continue
        for old, new in pairs:
            if old.startswith('"'):
                continue
            s = s.replace(old, new)
    if s != s0:
        open(path, 'w').write(s)
print('faltan:', missing or 'nada')
