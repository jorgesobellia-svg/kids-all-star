# Exámenes nuevos de los niveles 5 a 12 que preguntan de las 5 lecciones (aprobados por Jorge nivel por nivel).
# ('keep', n) = se queda la pregunta n del examen anterior.
EXAMS = {
 5: [
  ('keep', 1), ('keep', 2), ('keep', 4), ('keep', 7), ('keep', 12),
  {'lesson': '5.2', 'q': 'Llegas a segunda con tu batazo. ¿Qué hit es?', 'opts': ['Un doble', 'Un sencillo', 'Un triple'], 'correct': 'Un doble',
   'tr': {'q': ('You reach second on your hit. What kind of hit is it?', '你击球后跑到了二垒。这是哪种安打？', '打って二塁まで行けた。何のヒット？'),
          'o': [('A double', '二垒安打', 'ツーベースヒット'), ('A single', '一垒安打', 'シングルヒット'), ('A triple', '三垒安打', 'スリーベースヒット')]}},
  {'lesson': '5.3', 'q': 'La bola sale volando del campo sin tocar el suelo, en territorio fair. ¿Qué es?', 'opts': ['Un jonrón', 'Un doble por regla', 'Un foul'], 'correct': 'Un jonrón',
   'tr': {'q': ('The ball flies out of the park without touching the ground, in fair territory. What is it?', '球在界内没落地就飞出了球场。这是什么？', 'ボールがフェアゾーンで、地面にさわらずにグラウンドの外へ飛んでいった。これは何？'),
          'o': [('A home run', '本垒打', 'ホームラン'), ('A ground rule double', '场规二垒安打', 'グラウンドルールダブル'), ('A foul', '界外球', 'ファウル')]}},
  {'lesson': '5.3', 'q': 'Verdadero o falso: si la bola pica en territorio fair y después salta la valla, es jonrón', 'opts': ['Verdadero', 'Falso'], 'correct': 'Falso',
   'tr': {'q': ("True or false: if the ball bounces in fair territory and then goes over the fence, it's a home run", '对还是错：球在界内落地后弹过围栏，就是本垒打', '○か×か：フェアゾーンでバウンドしてからフェンスをこえたら、ホームラン')}},
  {'lesson': '5.4', 'q': 'Verdadero o falso: al correr a primera puedes pasarte de largo y volver sin peligro', 'opts': ['Verdadero', 'Falso'], 'correct': 'Verdadero',
   'tr': {'q': ('True or false: when you run to first, you can run past the base and come back safely', '对还是错：跑向一垒时，你可以跑过垒包，再安全地回来', '○か×か：一塁へ走るときは、通りすぎても安全にもどれる')}},
  {'lesson': '5.4', 'q': 'Te pasas de largo en segunda y te tocan con la bola fuera de la base. ¿Qué pasa?', 'opts': ['Eres out', 'Eres safe', 'No pasa nada'], 'correct': 'Eres out',
   'tr': {'q': ('You run past second and get tagged with the ball off the base. What happens?', '你跑过了二垒，离开垒包时被球触到。会怎样？', '二塁を通りすぎて、塁の外でボールでタッチされた。どうなる？'),
          'o': [("You're out", '你出局', 'アウト'), ("You're safe", '你安全上垒', 'セーフ'), ('Nothing happens', '什么都不会发生', '何も起きない')]}},
  {'lesson': '5.5', 'q': '¿Qué es un toque de bola (bunt)?', 'opts': ['Sostener el bate sin swing y dejar caer la bola suave', 'El swing más fuerte del juego', 'Un lanzamiento del pitcher'], 'correct': 'Sostener el bate sin swing y dejar caer la bola suave',
   'tr': {'q': ('What is a bunt?', '什么是触击（bunt）？', 'バントって何？'),
          'o': [('Holding the bat still, with no swing, and letting the ball drop softly', '握住球棒不挥棒，让球轻轻落下', 'バットをふらずにかまえて、ボールをやわらかく落とす'), ('The hardest swing in the game', '比赛中最用力的挥棒', 'いちばん強いスイング'), ("A pitcher's throw", '投手的投球', 'ピッチャーの投球')]}},
  {'lesson': '5.5', 'q': 'Con dos strikes, tu toque sale de foul. ¿Qué pasa?', 'opts': ['Es el tercer strike: ponche', 'Sigues bateando', 'Es bola'], 'correct': 'Es el tercer strike: ponche',
   'tr': {'q': ('With two strikes, your bunt goes foul. What happens?', '两好球时，你的触击打成界外球。会怎样？', '2ストライクでバントがファウルになった。どうなる？'),
          'o': [("It's strike three: you're out", '这是第三个好球：三振', '3つ目のストライク：三振'), ('You keep batting', '你继续击球', '打ち続ける'), ("It's a ball", '这是坏球', 'ボール')]}},
 ],
}
