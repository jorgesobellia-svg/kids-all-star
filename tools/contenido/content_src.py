# Genera los archivos de contenido por idioma a partir del guion (Versión 2).
# Cada valor es una tupla (es, en, zh-Hans, ja). Español = texto del guion, sin cambios.
import json, os, sys

L = ['es', 'en', 'zh-Hans', 'ja']
OUT = sys.argv[1]

def T(es, en, zh, ja):
    return (es, en, zh, ja)

TF = None  # marcador: opciones verdadero/falso salen de la interfaz

lessons = {}

def lesson(id, title, objective, demo, acts):
    lessons[id] = dict(title=title, objective=objective, demo=demo, acts=acts)

def act(q, ok, ko, opts=None, answer=None):
    d = dict(q=q, ok=ok, ko=ko)
    if opts: d['opts'] = opts
    if answer: d['answer'] = answer
    return d

# ---------------- Lección 1.1 ----------------
lesson('1.1',
  T('El diamante y el campo', 'The diamond and the field', '认识棒球场', 'ダイヤモンドとグラウンド'),
  T('Reconocer el campo completo: el cuadro (infield), los jardines (outfield) y las líneas de foul.',
    'Recognize the whole field: the infield, the outfield and the foul lines.',
    '认识整个棒球场：内野、外野和界外线。',
    'グラウンド全体を知ろう：内野、外野、ファウルライン。'),
  [
    T('¡Bienvenido al diamante! Así se llama el campo de béisbol en inglés: diamond.',
      "Welcome to the diamond! That's what we call a baseball field: the diamond.",
      '欢迎来到棒球场！棒球场在英语里叫 diamond，意思是钻石。',
      'ダイヤモンドへようこそ！野球のグラウンドは英語で diamond（ダイヤモンド）っていうんだ。'),
    T('Mira: la parte de tierra con las cuatro esquinas es el cuadro, en inglés infield.',
      'Look: the dirt part with the four corners is the infield.',
      '看：有四个角的泥土部分是内野，英语叫 infield。',
      '見て：4つの角がある土のところが内野。英語で infield だよ。'),
    T('La parte verde y grande de atrás son los jardines, en inglés outfield.',
      'The big green part in the back is the outfield.',
      '后面那片又大又绿的地方是外野，英语叫 outfield。',
      'うしろの広くて緑のところが外野。英語で outfield。'),
    T('Y estas dos líneas blancas que salen hacia los lados son las líneas de foul: separan el campo bueno del malo.',
      'And these two white lines going out to the sides are the foul lines: they separate the good part of the field from the bad part.',
      '这两条往两边延伸的白线是界外线：它们把好的场地和不好的场地分开。',
      'そして横にのびる2本の白い線がファウルライン。いいところとダメなところを分けているんだ。'),
  ],
  {
    '1': act(T('Toca la parte de tierra donde están las bases', 'Tap the dirt part where the bases are', '点一下有垒包的泥土部分', 'ベースがある土のところをタッチしよう'),
             T('¡Eso es! Ahí están las bases.', "That's it! That's where the bases are.", '对了！垒包就在那里。', 'そのとおり！そこにベースがあるよ。'),
             T('Casi: busca la parte de tierra, en el centro.', 'Almost: look for the dirt part in the middle.', '差一点：找中间的泥土部分。', 'おしい：まん中の土のところをさがしてね。'),
             answer=T('El cuadro (infield)', 'The infield', '内野 (infield)', '内野 (infield)')),
    '2': act(T('¿Cómo se llama la parte verde y grande detrás del cuadro?', "What's the big green part behind the infield called?", '内野后面那片又大又绿的地方叫什么？', '内野のうしろの、広くて緑のところは何ていう？'),
             T('¡Correcto! Outfield en inglés.', 'Correct! The outfield.', '正确！英语叫 outfield。', '正解！英語で outfield。'),
             T('Mira de nuevo: es la parte verde más lejos de home.', "Look again: it's the green part farthest from home plate.", '再看看：是离本垒最远的绿色部分。', 'もう一度見て：ホームプレートからいちばん遠い緑のところだよ。'),
             opts={'outfield': T('Los jardines (outfield)', 'The outfield', '外野 (outfield)', '外野 (outfield)'),
                   'dugout': T('El dugout', 'The dugout', '休息区', 'ダグアウト'),
                   'home': T('Home', 'Home plate', '本垒', 'ホームプレート')}),
    '3': act(T('Las líneas blancas de los lados se llaman líneas de foul', 'The white lines on the sides are called foul lines', '两边的白线叫界外线', '横の白い線はファウルラインという'),
             T('¡Sí! Foul lines en inglés.', 'Yes! Foul lines.', '对！英语叫 foul lines。', 'そう！英語で foul lines。'),
             T('Sí es verdadero: así se llaman esas líneas.', "It's true: that's what those lines are called.", '这是对的：那些线就叫界外线。', '正しいよ：その線はファウルラインっていうんだ。')),
    '4': act(T('Toca una línea de foul', 'Tap a foul line', '点一下界外线', 'ファウルラインをタッチしよう'),
             T('¡Bien tocada!', 'Nice tap!', '点得好！', 'ナイスタッチ！'),
             T('Esa no: las líneas de foul salen de home hacia los lados.', 'Not that one: the foul lines go out from home plate to the sides.', '不是那个：界外线从本垒向两边延伸。', 'それじゃないよ：ファウルラインはホームプレートから横にのびているよ。'),
             answer=T('Línea de foul (foul line)', 'Foul line', '界外线 (foul line)', 'ファウルライン (foul line)')),
    '5': act(T('¿Por qué al campo se le dice diamante?', 'Why is the field called a diamond?', '为什么棒球场被叫作钻石（diamond）？', 'どうしてグラウンドをダイヤモンドっていうの？'),
             T('¡Eso es! Diamond en inglés.', "That's it! The diamond.", '对了！英语叫 diamond。', 'そのとおり！英語で diamond。'),
             T('Fíjate en la forma del cuadro: parece un diamante.', 'Look at the shape of the infield: it looks like a diamond.', '看看内野的形状：像一颗钻石。', '内野の形を見て：ダイヤモンドみたいでしょ。'),
             opts={'shape': T('Por su forma, como un diamante girado', 'Because of its shape, like a turned diamond', '因为它的形状像一颗转过来的钻石', '形が、かたむけたダイヤモンドみたいだから'),
                   'money': T('Porque vale mucho dinero', "Because it's worth a lot of money", '因为它很值钱', 'お金がたくさんかかるから'),
                   'glass': T('Porque es de cristal', "Because it's made of glass", '因为它是玻璃做的', 'ガラスでできているから')}),
    '6': act(T('¿Dónde se juega en defensa cuando la bola va muy lejos?', 'Where do you play defense when the ball goes really far?', '球飞得很远时，在哪里防守？', 'ボールがとても遠くに飛んだら、どこで守る？'),
             T('¡Correcto! Lejos, en el outfield.', 'Correct! Far away, in the outfield.', '正确！很远的地方，就是外野（outfield）。', '正解！遠く、外野（outfield）だね。'),
             T('Lejos de home: en los jardines.', 'Far from home plate: in the outfield.', '离本垒很远：在外野。', 'ホームプレートから遠いところ：外野だよ。'),
             opts={'outfield': T('En los jardines', 'In the outfield', '在外野', '外野で'),
                   'dugout': T('En el dugout', 'In the dugout', '在休息区', 'ダグアウトで'),
                   'home': T('En home', 'At home plate', '在本垒', 'ホームプレートで')}),
  })

# ---------------- Lección 1.2 ----------------
lesson('1.2',
  T('Las bases en orden', 'The bases in order', '按顺序跑垒', 'ベースの順番'),
  T('Recorrer primera, segunda y tercera en el orden correcto, siempre en el mismo sentido.',
    'Run to first, second and third in the right order, always in the same direction.',
    '按正确顺序跑过一垒、二垒、三垒，方向永远一样。',
    '一塁、二塁、三塁を正しい順番で、いつも同じ向きに回ろう。'),
  [
    T('Cuando bateas, no corres a cualquier lado: corres en orden.', "When you hit the ball, you don't run just anywhere: you run in order.", '击球后，你不能随便乱跑：要按顺序跑。', '打ったら、好きなところに走るんじゃなくて、順番に走るよ。'),
    T('Primero primera base, first base.', 'First, first base.', '先跑一垒，英语叫 first base。', 'まず一塁、英語で first base。'),
    T('Después segunda base, second base.', 'Then, second base.', '然后是二垒，second base。', '次に二塁、second base。'),
    T('Después tercera base, third base.', 'Then, third base.', '再然后是三垒，third base。', 'その次に三塁、third base。'),
    T('Siempre dando la vuelta en el mismo sentido, como un cuadrado. ¡Mírame correrlo!', 'Always going around the same way, like a square. Watch me run it!', '总是朝同一个方向绕一圈，像一个正方形。看我跑一次！', 'いつも同じ向きに、四角をえがくように回るんだ。走るから見ててね！'),
  ],
  {
    '1': act(T('Bateaste. Toca la primera base a la que corres', 'You hit the ball. Tap the first base you run to', '你打出去了。点一下你最先跑向的垒', '打ったよ！最初に走るベースをタッチしよう'),
             T('¡Eso es! Siempre a primera primero.', "That's it! Always to first base first.", '对了！永远先跑一垒。', 'そのとおり！いつもまず一塁。'),
             T('No: la primera parada siempre es primera base.', 'No: your first stop is always first base.', '不对：第一站永远是一垒。', 'ちがうよ：最初はいつも一塁だよ。'),
             answer=T('Primera base (first base)', 'First base', '一垒 (first base)', '一塁 (first base)')),
    '2': act(T('Después de primera, ¿a qué base sigues?', 'After first base, which base is next?', '跑完一垒以后，下一个是哪个垒？', '一塁の次はどのベース？'),
             T('¡Correcto! Second base.', 'Correct! Second base.', '正确！二垒，second base。', '正解！二塁、second base。'),
             T('El orden es 1, 2, 3: primero va segunda.', 'The order is 1, 2, 3: second base comes first.', '顺序是 1、2、3：先到二垒。', '順番は1、2、3：先に二塁だよ。'),
             opts={'second': T('A segunda', 'To second base', '二垒', '二塁へ'),
                   'third': T('A tercera', 'To third base', '三垒', '三塁へ'),
                   'home': T('A home', 'To home plate', '本垒', 'ホームプレートへ')}),
    '3': act(T('Arrastra al corredor por las bases en orden hasta tercera', 'Drag the runner around the bases in order, all the way to third', '把跑垒员按顺序拖到三垒', 'ランナーを順番に三塁までドラッグしよう'),
             T('¡Ruta perfecta!', 'Perfect route!', '路线完美！', '完ぺきなルート！'),
             T('El orden no se salta: primera, segunda y después tercera.', "You can't skip the order: first, second, then third.", '顺序不能跳：一垒、二垒，然后三垒。', '順番はとばせないよ：一塁、二塁、それから三塁。'),
             answer=T('Primera, segunda, tercera', 'First, second, third', '一垒、二垒、三垒', '一塁、二塁、三塁')),
    '4': act(T('Un corredor puede correr de primera directo a tercera saltándose segunda', 'A runner can run from first straight to third, skipping second', '跑垒员可以从一垒直接跑到三垒，跳过二垒', 'ランナーは二塁をとばして、一塁から三塁へ直接走ってもいい'),
             T('¡Bien! Hay que pisar todas.', 'Good! You have to touch every base.', '很好！每个垒都要踩。', 'いいね！全部のベースをふまなきゃいけないよ。'),
             T('Falso: tiene que pisar segunda en el camino.', 'False: the runner has to touch second base on the way.', '错：中途一定要踩二垒。', 'まちがい：とちゅうで二塁をふまないといけないよ。')),
    '5': act(T('¿Qué forma hace el recorrido de las bases?', 'What shape does the path around the bases make?', '跑垒的路线是什么形状？', 'ベースを回る道はどんな形？'),
             T('¡Eso es! Por eso se le dice diamante.', "That's it! That's why it's called a diamond.", '对了！所以叫它 diamond（钻石）。', 'そのとおり！だからダイヤモンドっていうんだ。'),
             T('Cuatro esquinas: es un cuadrado girado.', "Four corners: it's a turned square.", '四个角：是一个转过来的正方形。', '角が4つ：かたむいた四角形だよ。'),
             opts={'square': T('Un cuadrado', 'A square', '正方形', '四角形'),
                   'circle': T('Un círculo', 'A circle', '圆形', '丸'),
                   'triangle': T('Un triángulo', 'A triangle', '三角形', '三角形')}),
    '6': act(T('Toca la tercera base', 'Tap third base', '点一下三垒', '三塁をタッチしよう'),
             T('¡Bien! Esa es la última antes de home.', "Good! That's the last one before home plate.", '很好！那是回本垒前的最后一个垒。', 'いいね！ホームプレートの前の最後のベースだよ。'),
             T('Tercera está al otro lado, antes de llegar a home.', 'Third base is on the other side, right before home plate.', '三垒在另一边，就在回到本垒之前。', '三塁は反対側、ホームプレートにつく前だよ。'),
             answer=T('Tercera base (third base)', 'Third base', '三垒 (third base)', '三塁 (third base)')),
  })

# ---------------- Lección 1.3 ----------------
lesson('1.3',
  T('Home: donde todo empieza y termina', 'Home plate: where it all starts and ends', '本垒：一切开始和结束的地方', 'ホームプレート：始まりと終わりの場所'),
  T('Entender que en home se batea, de home se sale y pisando home se anota la carrera.',
    'Understand that you bat at home plate, you start running from home plate, and you score a run by touching home plate.',
    '知道在本垒击球、从本垒出发、踩到本垒就得分。',
    'ホームプレートで打って、ホームプレートから走り出し、ホームプレートをふむと得点になることを知ろう。'),
  [
    T('Esta esquina especial no es una base como las demás: es home, en inglés home plate.', "This special corner isn't a base like the others: it's home plate.", '这个特别的角不是普通的垒：它是本垒，英语叫 home plate。', 'この特別な角は、ほかのベースとはちがうよ：ホームプレートなんだ。英語で home plate。'),
    T('Aquí te paras a batear. De aquí sales corriendo.', 'This is where you stand to bat. This is where you start running.', '你站在这里击球，也从这里开始跑。', 'ここに立って打つよ。ここから走り出すんだ。'),
    T('Y si logras dar toda la vuelta y pisar home otra vez, ¡anotaste una carrera! En inglés: run.', 'And if you make it all the way around and touch home plate again, you scored a run!', '如果你跑完一圈又踩到本垒，你就得分了！英语叫 run。', 'ぐるっと一周してまたホームプレートをふんだら、得点！英語で run。'),
  ],
  {
    '1': act(T('Toca home', 'Tap home plate', '点一下本垒', 'ホームプレートをタッチしよう'),
             T('¡Eso es! La esquina con forma de casita.', "That's it! The corner shaped like a little house.", '对了！就是形状像小房子的那个角。', 'そのとおり！小さなおうちの形の角だよ。'),
             T('Home es la esquina de abajo, donde se batea.', 'Home plate is the bottom corner, where you bat.', '本垒在下面的角，就是击球的地方。', 'ホームプレートは下の角、打つところだよ。'),
             answer=T('Home (home plate)', 'Home plate', '本垒 (home plate)', 'ホームプレート (home plate)')),
    '2': act(T('¿Qué haces parado en home al empezar tu turno?', 'What do you do standing at home plate when your turn starts?', '轮到你时，你站在本垒做什么？', '自分の番が始まって、ホームプレートに立ったら何をする？'),
             T('¡Correcto! Ahí empieza tu turno.', "Correct! That's where your turn starts.", '正确！你的回合从这里开始。', '正解！そこから自分の番が始まるよ。'),
             T('En home te toca batear.', "At home plate, it's your turn to bat.", '在本垒，轮到你击球。', 'ホームプレートでは、打つ番だよ。'),
             opts={'bat': T('Batear', 'Bat', '击球', '打つ'),
                   'pitch': T('Lanzar', 'Pitch', '投球', '投げる'),
                   'wait': T('Esperar en el dugout', 'Wait in the dugout', '在休息区等', 'ダグアウトで待つ')}),
    '3': act(T('¿Cuándo anotas una carrera?', 'When do you score a run?', '什么时候得分？', '得点になるのはいつ？'),
             T('¡Eso es! Run anotada.', "That's it! Run scored.", '对了！得分（run）！', 'そのとおり！得点（run）！'),
             T('Solo cuenta cuando completas la vuelta y pisas home.', 'It only counts when you go all the way around and touch home plate.', '只有跑完一圈并踩到本垒才算。', '一周してホームプレートをふんだときだけ数えるよ。'),
             opts={'lap': T('Cuando pisas home después de dar la vuelta', 'When you touch home plate after going all the way around', '跑完一圈后踩到本垒时', '一周してホームプレートをふんだとき'),
                   'second': T('Cuando llegas a segunda', 'When you get to second base', '跑到二垒时', '二塁についたとき'),
                   'hit': T('Cuando bateas la bola', 'When you hit the ball', '击中球时', 'ボールを打ったとき')}),
    '4': act(T('Home tiene forma de almohadilla cuadrada como las demás bases', 'Home plate is a square cushion like the other bases', '本垒和其他垒一样，是方形的垫子', 'ホームプレートは、ほかのベースと同じ四角いクッションだ'),
             T('¡Bien! Home es plano y tiene punta, como una casita.', 'Good! Home plate is flat and pointed, like a little house.', '很好！本垒是扁平的，有个尖角，像小房子。', 'いいね！ホームプレートは平らで、とがった角があるおうちの形だよ。'),
             T('Falso: home es diferente, es una placa plana.', "False: home plate is different, it's a flat plate.", '错：本垒不一样，它是一块扁平的板子。', 'まちがい：ホームプレートはちがって、平らな板なんだ。')),
    '5': act(T('El corredor pisó home. ¿Qué se anotó?', 'The runner touched home plate. What was scored?', '跑垒员踩到了本垒。得到了什么？', 'ランナーがホームプレートをふんだ。何がついた？'),
             T('¡Carrera! Así se suma un punto en béisbol.', "Run! That's how you get a point in baseball.", '得分！棒球就是这样加分的。', '得点！野球ではこうして点が入るんだ。'),
             T('Al pisar home se anota una carrera, no un out.', 'Touching home plate scores a run, not an out.', '踩到本垒就是得分，不是出局。', 'ホームプレートをふむと得点。アウトじゃないよ。'),
             opts={'run': T('Una carrera (run)', 'A run', '得分 (run)', '得点 (run)'),
                   'out': T('Un out', 'An out', '出局', 'アウト'),
                   'strike': T('Un strike', 'A strike', '好球', 'ストライク')}),
    '6': act(T('¿Cómo se llaman los puntos en béisbol?', 'What are points called in baseball?', '棒球里的分数叫什么？', '野球の点は何ていう？'),
             T('¡Correcto! En béisbol son carreras, runs.', "Correct! In baseball they're runs.", '正确！棒球的分数叫得分（run）。', '正解！野球の点は得点、ランっていうよ。'),
             T('En béisbol no hay goles: hay carreras.', 'There are no goals in baseball: there are runs.', '棒球里没有进球：只有得分。', '野球にゴールはないよ：得点（ラン）だよ。'),
             opts={'runs': T('Carreras', 'Runs', '得分', '得点 / ラン'),
                   'goals': T('Goles', 'Goals', '进球', 'ゴール'),
                   'baskets': T('Canastas', 'Baskets', '投篮', 'バスケット')}),
  })

# ---------------- Lección 1.4 ----------------
lesson('1.4',
  T('El dugout y la espera', 'The dugout and waiting your turn', '休息区和等待', 'ダグアウトで待つ'),
  T('Saber dónde espera el equipo que está bateando y que hay un jugador preparándose para seguir.',
    'Know where the batting team waits, and that one player gets ready to bat next.',
    '知道进攻的球队在哪里等待，也知道有一个球员正在准备下一个上场。',
    '打つチームがどこで待つか、次のバッターが準備していることを知ろう。'),
  [
    T('¿Y dónde espera tu equipo mientras batea? En el dugout: la banca larga al lado del campo.', "And where does your team wait while it's batting? In the dugout: the long bench next to the field.", '你的球队击球时在哪里等？在休息区：球场旁边的长椅，英语叫 dugout。', '打っているとき、チームはどこで待つの？ダグアウト：グラウンドの横の長いベンチだよ。'),
    T('Ahí se sientan los que esperan su turno, con su casco listo.', "That's where players sit while they wait for their turn, with their helmet ready.", '等着轮到自己的队员坐在那里，头盔都准备好了。', '自分の番を待つ人はそこにすわって、ヘルメットを用意しておくんだ。'),
    T('Y el que sigue después del bateador se va preparando cerca de home, en el círculo de espera. En inglés: on-deck circle.', "And the player who's up after the batter gets ready near home plate, in the on-deck circle.", '下一个击球的人会在本垒附近的待打区准备，英语叫 on-deck circle。', '次に打つ人は、ホームプレートの近くのネクストバッターズサークルで準備するよ。英語で on-deck circle。'),
  ],
  {
    '1': act(T('Toca el dugout', 'Tap the dugout', '点一下休息区', 'ダグアウトをタッチしよう'),
             T('¡Eso es! Ahí espera el equipo.', "That's it! That's where the team waits.", '对了！球队在那里等待。', 'そのとおり！チームはそこで待つよ。'),
             T('El dugout es la banca al lado del campo.', 'The dugout is the bench next to the field.', '休息区是球场旁边的长椅。', 'ダグアウトはグラウンドの横のベンチだよ。'),
             answer=T('El dugout', 'The dugout', '休息区 (dugout)', 'ダグアウト (dugout)')),
    '2': act(T('¿Quiénes están en el dugout?', 'Who is in the dugout?', '谁在休息区？', 'ダグアウトにいるのはだれ？'),
             T('¡Correcto! Los que defienden están en el campo.', 'Correct! The defense is out on the field.', '正确！防守的球队在场上。', '正解！守っているチームはグラウンドにいるよ。'),
             T('En el dugout espera el equipo al bate.', 'The team at bat waits in the dugout.', '在休息区等待的是击球的球队。', 'ダグアウトで待つのは打つチームだよ。'),
             opts={'batting': T('El equipo que está bateando', "The team that's batting", '正在击球的球队', '打っているチーム'),
                   'defending': T('El equipo que defiende', "The team that's on defense", '正在防守的球队', '守っているチーム'),
                   'umps': T('Los árbitros', 'The umpires', '裁判', '審判')}),
    '3': act(T('En el dugout te puedes quitar el casco y relajarte sin prestar atención al juego', 'In the dugout you can take off your helmet and relax without paying attention to the game', '在休息区可以摘下头盔放松，不用看比赛', 'ダグアウトではヘルメットをぬいで、試合を見ないでリラックスしていい'),
             T('¡Bien! Siempre atento: una bola de foul puede llegar.', 'Good! Always pay attention: a foul ball can fly in.', '很好！要一直专心：界外球可能会飞过来。', 'いいね！いつも注意しよう：ファウルボールが飛んでくるかも。'),
             T('Falso: en el dugout también se está atento al juego.', 'False: in the dugout you still pay attention to the game.', '错：在休息区也要专心看比赛。', 'まちがい：ダグアウトでも試合をよく見ているんだよ。')),
    '4': act(T('¿Quién se prepara en el círculo de espera?', 'Who gets ready in the on-deck circle?', '谁在待打区准备？', 'ネクストバッターズサークルで準備するのはだれ？'),
             T('¡Eso es! On-deck en inglés.', "That's it! On deck.", '对了！英语叫 on-deck。', 'そのとおり！英語で on-deck。'),
             T('El que sigue se prepara ahí, casco puesto.', 'The next batter gets ready there, helmet on.', '下一个击球员在那里准备，戴好头盔。', '次のバッターがヘルメットをかぶって準備するよ。'),
             opts={'next': T('El bateador que sigue', 'The next batter', '下一个击球员', '次のバッター'),
                   'pitcher': T('El pitcher', 'The pitcher', '投手', 'ピッチャー'),
                   'catcher': T('El catcher', 'The catcher', '捕手', 'キャッチャー')}),
    '5': act(T('¿Qué debes tener listo en el dugout antes de tu turno?', 'What should you have ready in the dugout before your turn?', '轮到你之前，在休息区要准备好什么？', '自分の番の前に、ダグアウトで何を用意しておく？'),
             T('¡Correcto! Listo para salir sin hacer esperar.', 'Correct! Ready to go without making anyone wait.', '正确！准备好，不让大家等。', '正解！みんなを待たせないで出られるね。'),
             T('Tu turno llega rápido: casco y bate listos.', 'Your turn comes fast: helmet and bat ready.', '很快就轮到你：准备好头盔和球棒。', '番はすぐ来るよ：ヘルメットとバットを用意しよう。'),
             opts={'gear': T('El casco y el bate', 'Your helmet and bat', '头盔和球棒', 'ヘルメットとバット'),
                   'snack': T('La merienda', 'Your snack', '零食', 'おやつ'),
                   'phone': T('El teléfono', 'Your phone', '手机', 'スマホ')}),
    '6': act(T('Termina un turno al bate. ¿Qué pasa con ese equipo?', "A team's turn at bat ends. What happens to that team?", '一个球队的击球回合结束了。这个球队接下来做什么？', '打つ番が終わった。そのチームはどうする？'),
             T('¡Eso es! Los equipos se turnan.', "That's it! The teams take turns.", '对了！两队轮流来。', 'そのとおり！チームは交代するんだ。'),
             T('Cuando termina de batear, ese equipo sale a defender.', 'When a team finishes batting, it goes out to play defense.', '击球结束后，这个球队就上场防守。', '打つ番が終わったら、そのチームは守りにつくよ。'),
             opts={'defend': T('Sale a defender al campo', 'It goes out to play defense', '上场防守', '守りにグラウンドへ出る'),
                   'home': T('Se va a su casa', 'It goes home', '回家', '家に帰る'),
                   'keep': T('Sigue bateando', 'It keeps batting', '继续击球', '打ち続ける')}),
  })

# ---------------- Lección 1.5 ----------------
lesson('1.5',
  T('Mi equipo para jugar', 'My baseball gear', '我的棒球装备', '野球の道具'),
  T('Distinguir bate, guante, casco y pelota, y la regla de oro: casco puesto para batear y correr las bases.',
    'Tell apart the bat, glove, helmet and ball, and the golden rule: helmet on to bat and run the bases.',
    '分清球棒、手套、头盔和棒球，记住黄金规则：击球和跑垒都要戴头盔。',
    'バット、グローブ、ヘルメット、ボールを見分けよう。大事なルール：打つときと走るときはヘルメットをかぶる。'),
  [
    T('Para jugar necesitas tu equipo.', 'To play, you need your gear.', '打棒球需要你的装备。', '野球をするには道具がいるよ。'),
    T('El bate, bat, es para pegarle a la bola.', 'The bat is for hitting the ball.', '球棒（bat）用来击球。', 'バット（bat）はボールを打つためのもの。'),
    T('El guante, glove, es para atraparla sin que duela.', 'The glove is for catching it without it hurting.', '手套（glove）用来接球，接住了也不会痛。', 'グローブ（glove）は、いたくないようにボールをとるためのもの。'),
    T('La pelota, ball.', 'The ball.', '棒球（ball）。', 'ボール（ball）。'),
    T('Y lo más importante para cuidarte: el casco, helmet. Sin casco no se batea y no se corren las bases. ¡Primero la seguridad!', 'And the most important thing to keep you safe: the helmet. No helmet, no batting and no running the bases. Safety first!', '最重要的保护：头盔（helmet）。没戴头盔不能击球，也不能跑垒。安全第一！', 'そして自分を守るためにいちばん大事なのが、ヘルメット（helmet）。ヘルメットなしでは打てないし、ベースも走れない。安全第一！'),
  ],
  {
    '1': act(T('¿Con qué le pegas a la bola?', 'What do you hit the ball with?', '你用什么击球？', 'ボールを何で打つ？'),
             T('¡Correcto! Bat en inglés.', 'Correct! The bat.', '正确！英语叫 bat。', '正解！英語で bat。'),
             T('A la bola se le pega con el bate.', 'You hit the ball with the bat.', '击球要用球棒。', 'ボールはバットで打つよ。'),
             opts={'bat': T('El bate (bat)', 'The bat', '球棒 (bat)', 'バット (bat)'),
                   'glove': T('El guante', 'The glove', '手套', 'グローブ'),
                   'helmet': T('El casco', 'The helmet', '头盔', 'ヘルメット')}),
    '2': act(T('¿Con qué atrapas la bola?', 'What do you catch the ball with?', '你用什么接球？', 'ボールを何でとる？'),
             T('¡Eso es! Glove en inglés.', "That's it! The glove.", '对了！英语叫 glove。', 'そのとおり！英語で glove。'),
             T('Atrapas con el guante, en tu mano contraria a la que lanza.', "You catch with the glove, on the hand you don't throw with.", '用手套接球，戴在不投球的那只手上。', '投げない方の手にはめたグローブでとるよ。'),
             opts={'glove': T('El guante (glove)', 'The glove', '手套 (glove)', 'グローブ (glove)'),
                   'bat': T('El bate', 'The bat', '球棒', 'バット'),
                   'home': T('Home', 'Home plate', '本垒', 'ホームプレート')}),
    '3': act(T('El casco protege tu cabeza cuando bateas y corres las bases', 'The helmet protects your head when you bat and run the bases', '击球和跑垒时，头盔保护你的头', 'ヘルメットは、打つときと走るときに頭を守ってくれる'),
             T('¡Sí! Por eso nunca se quita a mitad de camino.', "Yes! That's why you never take it off halfway.", '对！所以跑到一半也不能摘下来。', 'そう！だからとちゅうでぬいじゃダメなんだ。'),
             T('Verdadero: el casco es protección, no adorno.', 'True: the helmet is protection, not decoration.', '这是对的：头盔是保护用的，不是装饰。', '正しいよ：ヘルメットはかざりじゃなくて、身を守るものだよ。')),
    '4': act(T('Vas a batear y no tienes casco. ¿Qué haces?', "You're about to bat and you don't have a helmet. What do you do?", '你要击球了，可是没有头盔。怎么办？', '打つ番なのに、ヘルメットがない。どうする？'),
             T('¡Muy bien! Sin casco, no se batea.', 'Great! No helmet, no batting.', '非常好！没戴头盔不能击球。', 'よくできました！ヘルメットなしでは打たないよ。'),
             T('Nunca batees sin casco: pide uno primero.', 'Never bat without a helmet: ask for one first.', '绝对不要不戴头盔击球：先要一个。', 'ヘルメットなしで打っちゃダメ：まずかしてもらおう。'),
             opts={'ask': T('Pides un casco antes de batear', 'Ask for a helmet before batting', '击球前先要一个头盔', '打つ前にヘルメットをかしてもらう'),
                   'anyway': T('Bateas así mismo', 'Bat anyway', '直接去击球', 'そのまま打つ'),
                   'cap': T('Bateas con la gorra al revés', 'Bat with your cap on backwards', '把帽子反戴就去击球', 'ぼうしを後ろ向きにかぶって打つ')}),
    '5': act(T('Toca la pelota en la imagen del equipo', 'Tap the ball in the picture of the gear', '在装备图里点一下棒球', '道具の絵の中のボールをタッチしよう'),
             T('¡Bien! Blanca, con costuras rojas.', 'Good! White, with red stitches.', '很好！白色的，有红色缝线。', 'いいね！白くて、赤いぬい目があるよ。'),
             T('Esa redonda con costuras es la pelota.', 'The round one with stitches is the ball.', '那个圆圆的、有缝线的就是棒球。', 'ぬい目がある丸いのがボールだよ。'),
             answer=T('La pelota (ball)', 'The ball', '棒球 (ball)', 'ボール (ball)')),
    '6': act(T('¿En qué mano va el guante si lanzas con la derecha?', 'Which hand does the glove go on if you throw with your right?', '如果你用右手投球，手套戴在哪只手上？', '右手で投げるなら、グローブはどっちの手にはめる？'),
             T('¡Correcto! Lanzas con una y atrapas con la otra.', 'Correct! You throw with one and catch with the other.', '正确！一只手投，另一只手接。', '正解！片方で投げて、もう片方でとるんだ。'),
             T('El guante va en la mano que no lanza.', "The glove goes on the hand you don't throw with.", '手套戴在不投球的那只手上。', 'グローブは投げない方の手にはめるよ。'),
             opts={'left': T('En la izquierda', 'On the left', '左手', '左手'),
                   'right': T('En la derecha', 'On the right', '右手', '右手'),
                   'both': T('En las dos', 'On both', '两只手', '両手')}),
  })

# ---------------- Examen del Nivel 1 ----------------
exam1 = {
  '1': dict(q=T('¿Cómo se llama la parte de tierra donde están las bases?', "What's the dirt part where the bases are called?", '有垒包的泥土部分叫什么？', 'ベースがある土のところは何ていう？'),
            opts={'infield': T('El cuadro (infield)', 'The infield', '内野 (infield)', '内野 (infield)'),
                  'outfield': T('Los jardines', 'The outfield', '外野', '外野'),
                  'dugout': T('El dugout', 'The dugout', '休息区', 'ダグアウト')}),
  '2': dict(q=T('Toca home en el diagrama', 'Tap home plate on the diagram', '在图上点一下本垒', '図のホームプレートをタッチしよう'),
            answer=T('Home', 'Home plate', '本垒', 'ホームプレート')),
  '3': dict(q=T('¿Cuál es el orden correcto de las bases?', "What's the right order of the bases?", '正确的跑垒顺序是什么？', 'ベースの正しい順番は？'),
            opts={'o123': T('Primera, segunda, tercera', 'First, second, third', '一垒、二垒、三垒', '一塁、二塁、三塁'),
                  'o312': T('Tercera, primera, segunda', 'Third, first, second', '三垒、一垒、二垒', '三塁、一塁、二塁'),
                  'o213': T('Segunda, primera, tercera', 'Second, first, third', '二垒、一垒、三垒', '二塁、一塁、三塁')}),
  '4': dict(q=T('¿Dónde espera el equipo que está bateando?', 'Where does the batting team wait?', '击球的球队在哪里等？', '打つチームはどこで待つ？'),
            opts={'dugout': T('En el dugout', 'In the dugout', '在休息区', 'ダグアウトで'),
                  'outfield': T('En los jardines', 'In the outfield', '在外野', '外野で'),
                  'behind': T('Detrás de home', 'Behind home plate', '在本垒后面', 'ホームプレートのうしろで')}),
  '5': dict(q=T('¿Qué anotas cuando pisas home después de dar la vuelta?', 'What do you score when you touch home plate after going around?', '跑完一圈踩到本垒，你得到什么？', '一周してホームプレートをふむと何がつく？'),
            opts={'run': T('Una carrera (run)', 'A run', '得分 (run)', '得点 (run)'),
                  'strike': T('Un strike', 'A strike', '好球', 'ストライク'),
                  'out': T('Un out', 'An out', '出局', 'アウト')}),
  '6': dict(q=T('¿Cómo se llama la parte verde y grande de atrás?', "What's the big green part in the back called?", '后面又大又绿的部分叫什么？', 'うしろの広くて緑のところは何ていう？'),
            opts={'outfield': T('Los jardines (outfield)', 'The outfield', '外野 (outfield)', '外野 (outfield)'),
                  'infield': T('El cuadro', 'The infield', '内野', '内野'),
                  'ondeck': T('El círculo de espera', 'The on-deck circle', '待打区', 'ネクストバッターズサークル')}),
  '7': dict(q=T('Verdadero o falso: las líneas de los lados se llaman líneas de foul', 'True or false: the lines on the sides are called foul lines', '对还是错：两边的线叫界外线', '○か×か：横の線はファウルラインという')),
  '8': dict(q=T('¿Con qué atrapas la bola?', 'What do you catch the ball with?', '你用什么接球？', 'ボールを何でとる？'),
            opts={'glove': T('El guante (glove)', 'The glove', '手套 (glove)', 'グローブ (glove)'),
                  'bat': T('El bate', 'The bat', '球棒', 'バット'),
                  'helmet': T('El casco', 'The helmet', '头盔', 'ヘルメット')}),
  '9': dict(q=T('¿Qué debes ponerte siempre para batear?', 'What must you always wear to bat?', '击球时一定要戴什么？', '打つときに必ずかぶるものは？'),
            opts={'helmet': T('El casco (helmet)', 'The helmet', '头盔 (helmet)', 'ヘルメット (helmet)'),
                  'cap': T('La gorra al revés', 'Your cap on backwards', '反戴的帽子', '後ろ向きのぼうし'),
                  'nothing': T('Nada', 'Nothing', '什么都不用', '何もいらない')}),
  '10': dict(q=T('¿Quién se prepara en el círculo de espera?', 'Who gets ready in the on-deck circle?', '谁在待打区准备？', 'ネクストバッターズサークルで準備するのはだれ？'),
             opts={'next': T('El bateador que sigue', 'The next batter', '下一个击球员', '次のバッター'),
                   'pitcher': T('El pitcher', 'The pitcher', '投手', 'ピッチャー'),
                   'ump': T('El umpire', 'The umpire', '裁判', '審判')}),
  '11': dict(q=T('Toca la segunda base en el diagrama', 'Tap second base on the diagram', '在图上点一下二垒', '図の二塁をタッチしよう'),
             answer=T('Segunda base', 'Second base', '二垒', '二塁')),
  '12': dict(q=T('¿Cómo se llaman los puntos en béisbol?', 'What are points called in baseball?', '棒球里的分数叫什么？', '野球の点は何ていう？'),
             opts={'runs': T('Carreras', 'Runs', '得分', '得点'),
                   'goals': T('Goles', 'Goals', '进球', 'ゴール'),
                   'hoops': T('Puntos de canasta', 'Basketball points', '投篮得分', 'バスケットの点')}),
}

levels = {
  '1': dict(title=T('Bienvenido al diamante', 'Welcome to the diamond', '欢迎来到棒球场', 'ダイヤモンドへようこそ'),
            badge=T('Diamante Novato', 'Rookie Diamond', '棒球场新秀', 'ルーキーダイヤモンド')),
  '2': dict(title=T('Las posiciones', 'The positions', '守备位置', 'ポジション'),
            badge=T('Guardián del Campo', 'Field Guardian', '球场守护者', 'フィールドガーディアン')),
  '3': dict(title=T('Cómo se juega', 'How the game works', '比赛怎么进行', '試合の進み方'),
            badge=T('Cerebro del Juego', 'Game Brain', '比赛智多星', 'ゲームの頭脳')),
  '4': dict(title=T('El conteo', 'The count', '球数', 'カウント'),
            badge=T('Ojo de Águila', 'Eagle Eye', '鹰眼', 'イーグルアイ')),
}

# Títulos del mapa de las 20 lecciones (para el camino, el candado Plus y el álbum).
map_titles = {
  '1.1': lessons['1.1']['title'], '1.2': lessons['1.2']['title'], '1.3': lessons['1.3']['title'],
  '1.4': lessons['1.4']['title'], '1.5': lessons['1.5']['title'],
  '2.1': T('Pitcher y catcher: la batería', 'Pitcher and catcher: the battery', '投手和捕手：投捕搭档', '投手と捕手：バッテリー'),
  '2.2': T('Primera y tercera: las esquinas', 'First and third: the corners', '一垒手和三垒手：两个角', '一塁手と三塁手：内野の角'),
  '2.3': T('Segunda y campocorto: el medio', 'Second and shortstop: the middle', '二垒手和游击手：中间', '二塁手と遊撃手：まん中'),
  '2.4': T('Los tres jardineros', 'The three outfielders', '三名外野手', '3人の外野手'),
  '2.5': T('Las 9 posiciones y sus números', 'The 9 positions and their numbers', '9个守备位置和它们的号码', '9つのポジションと番号'),
  '3.1': T('La entrada: alta y baja', 'The inning: top and bottom', '一局：上半局和下半局', 'イニング：表と裏'),
  '3.2': T('Tres outs y cambia el turno', 'Three outs and switch', '三出局，攻守交换', '3アウトでチェンジ'),
  '3.3': T('Cómo se anota una carrera', 'How to score a run', '怎样得分', '得点の入り方'),
  '3.4': T('El orden al bate', 'The batting order', '打击顺序', '打順'),
  '3.5': T('Quién gana el juego', 'Who wins the game', '谁赢得比赛', '試合に勝つのはだれ'),
  '4.1': T('Bola y strike', 'Ball and strike', '坏球和好球', 'ボールとストライク'),
  '4.2': T('La zona de strike', 'The strike zone', '好球带', 'ストライクゾーン'),
  '4.3': T('El foul', 'The foul ball', '界外球', 'ファウルボール'),
  '4.4': T('Ponche y base por bolas', 'Strikeout and walk', '三振和四坏球保送', '三振と四球'),
  '4.5': T('Golpeado y conteo completo', 'Hit by pitch and full count', '触身球和满球数', '死球とフルカウント'),
}

# Glosario del documento (Nivel 1 + términos que aparecen en las opciones del Nivel 1).
glossary = {
  'diamond': T('El diamante / el campo', 'Diamond / field', '棒球场', 'ダイヤモンド / グラウンド'),
  'infield': T('El cuadro', 'Infield', '内野', '内野'),
  'outfield': T('Los jardines', 'Outfield', '外野', '外野'),
  'foulLine': T('Línea de foul', 'Foul line', '界外线', 'ファウルライン'),
  'home': T('Home / plato', 'Home plate', '本垒', 'ホームプレート'),
  'first': T('Primera base', 'First base', '一垒', '一塁'),
  'second': T('Segunda base', 'Second base', '二垒', '二塁'),
  'third': T('Tercera base', 'Third base', '三垒', '三塁'),
  'run': T('Carrera', 'Run', '得分', '得点 / ラン'),
  'dugout': T('El dugout', 'Dugout', '休息区', 'ダグアウト / ベンチ'),
  'onDeck': T('Círculo de espera', 'On-deck circle', '待打区', 'ネクストバッターズサークル'),
  'bat': T('El bate', 'Bat', '球棒', 'バット'),
  'glove': T('El guante', 'Glove', '手套', 'グローブ'),
  'helmet': T('El casco', 'Helmet', '头盔', 'ヘルメット'),
  'ball': T('La pelota', 'Ball', '棒球', 'ボール'),
  'pitcher': T('Lanzador', 'Pitcher', '投手', '投手 / ピッチャー'),
  'catcher': T('Receptor', 'Catcher', '捕手', '捕手 / キャッチャー'),
  'out': T('Out', 'Out', '出局', 'アウト'),
  'strike': T('Strike', 'Strike', '好球', 'ストライク'),
  'umpire': T('Árbitro', 'Umpire', '裁判', '審判 / アンパイア'),
  'foulBall': T('Foul', 'Foul ball', '界外球', 'ファウルボール'),
}

for _f in ['content_l2.py', 'content_l3.py', 'content_l4.py']:
    exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), _f)).read())

# Niveles 5 a 12 (guion definitivo, Versión Fusionada): generados por v3/build.py.
exams_v3 = {}
_v3 = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'v3', 'v3_content.py')
if os.path.exists(_v3):
    exec(open(_v3).read())

def pick(x, i):
    if isinstance(x, tuple): return x[i]
    if isinstance(x, dict): return {k: pick(v, i) for k, v in x.items()}
    if isinstance(x, list): return [pick(v, i) for v in x]
    return x

for i, lang in enumerate(L):
    d = os.path.join(OUT, lang); os.makedirs(d, exist_ok=True)
    content = {
      'levels': pick(levels, i),
      'lessonTitles': pick(map_titles, i),
      'lessons': pick(lessons, i),
      'exams': {'1': pick(exam1, i), '2': pick(exam2, i), '3': pick(exam3, i), '4': pick(exam4, i), **{k: pick(v, i) for k, v in exams_v3.items()}},
    }
    json.dump(content, open(os.path.join(d, 'content.json'), 'w'), ensure_ascii=False, indent=2)
    json.dump(pick(glossary, i), open(os.path.join(d, 'glossary.json'), 'w'), ensure_ascii=False, indent=2)
print('ok', len(lessons), 'lessons')
