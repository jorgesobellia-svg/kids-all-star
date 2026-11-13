# Ajusta las traducciones (en, zh-Hans, ja) a la revisión del español aprobada por Jorge.
# Cada idioma se escribe como se diría en ese idioma, no palabra por palabra.
import os

HERE = os.path.dirname(os.path.abspath(__file__))
E = {
 5: [
  ("('Good! First base is your first stop.', '很好！那是你的安全区。', 'いいね！君の安全地帯。')",
   "(\"Good! That's your safe spot.\", '很好！那是你的安全区。', 'いいね！君の安全地帯。')"),
  ("'q': (\"You hit the ball and reach base safely. What's that called?\", '“安打”的英语怎么说？', 'ヒットは英語で何という？'), 'o': [('Hit', 'Hit', 'Hit'),",
   "'q': (\"What's a hit that gets you to first base called?\", '一垒安打的英语怎么说？', 'シングルヒットは英語で何という？'), 'o': [('Single', 'Single', 'Single'),"),
 ],
 6: [
  ("('With no force, you have to tag the runner.', '没有被封，就要触碰跑垒员。',",
   "(\"If he isn't forced, you have to tag the runner.\", '如果不是封杀，就要触碰跑垒员。',"),
  ("('The runner stepped off second and is away from the base. Tap who has to be tagged with the ball', '跑垒员离开了二垒，不在垒包上。点一下要用球去碰的人', 'ランナーが二塁をはなれている。ボールでタッチする相手をタッチしよう')",
   "('The runner stepped off second and is away from the base. Tap the runner who has to be tagged with the ball', '跑垒员离开了二垒，不在垒包上。点一下要用球去触碰的跑垒员', 'ランナーが二塁をはなれている。ボールでタッチしないといけないランナーをタッチしよう')"),
  ("(\"With nobody on first, there's no force at second.\", '一垒没人，二垒就没有封杀。',",
   "(\"With nobody on first, the runner on second isn't forced.\", '一垒没人，二垒的跑垒员就不是被封杀。',"),
  ("('To decide if there is a force, you look at whether the base behind is taken', '要判断有没有封杀，就看后面的垒上有没有人', 'フォースかどうかは、うしろの塁にランナーがいるかを見て決める')",
   "('To know if a runner is forced, you look at whether the base behind him is taken', '要知道跑垒员是不是被封杀，就看他后面的垒上有没有人', 'ランナーがフォースかどうかは、うしろの塁にランナーがいるかを見ればわかる')"),
  ("('Safe! There was no force', '安全上垒！没有封杀', 'セーフ！フォースじゃなかった')",
   "(\"Safe! He wasn't forced\", '安全上垒！他不是被封杀', 'セーフ！フォースじゃなかった')"),
  ("(\"Without a force, stepping on the base doesn't work.\", '没有封杀，踩垒包没用。',",
   "(\"If he isn't forced, stepping on the base doesn't work.\", '如果不是封杀，踩垒包没用。',"),
  ("('Good! No force, no recipe.', '很好！没有封杀，就没有这个配方。', 'いいね！フォースがなければ、つくれない。')",
   "('Good! No forced runner, no recipe.', '很好！没有被封杀的跑垒员，就没有这个配方。', 'いいね！フォースのランナーがいなければ、つくれない。')"),
  ("('True: the double play comes from the force.', '这是对的：双杀来自封杀。', '正しいよ：ダブルプレーはフォースから生まれるんだ。')",
   "('True: the double play starts with a forced runner.', '这是对的：双杀来自被封杀的跑垒员。', '正しいよ：ダブルプレーはフォースのランナーから生まれるんだ。')"),
  ("(\"True or false: it's the same if you catch it with the glove or if it bounces off the glove and falls to the ground\", '对还是错：用手套接住，和球从手套弹出掉到地上，是一样的', '○か×か：グラブでとっても、グラブではじいて地面に落ちても、同じ')",
   "(\"True or false: if the ball bounces off your glove and falls to the ground, it's still an out\", '对还是错：球从你的手套弹出掉到地上，照样出局', '○か×か：ボールがグラブではねて地面に落ちても、アウトになる')"),
 ],
 7: [
  ("('False: one base, one runner.', '错：这个家只能住一个人。', 'まちがい：家は1人用だよ。')",
   "('False: one base, one runner.', '错：一个垒只能有一个跑垒员。', 'まちがい：塁は1人用だよ。')"),
  ("('That base already belonged to the runner ahead.', '后来的跑垒员在那里没有家。', 'あとから来たランナーには、そこに家がなかったんだ。')",
   "('That base already belonged to the runner ahead.', '后来的跑垒员在那里没有位置。', 'あとから来たランナーには、そこに場所がなかったんだ。')"),
  ("(\"Good! That's his safe spot.\", '很好！那是他的家。', 'いいね！そこが家だ。')",
   "(\"Good! That's his base.\", '很好！那是他的垒。', 'いいね！そこが彼の塁だ。')"),
  ("(\"Correct! Off your base, you're in danger.\", '正确！离开家就有危险。', '正解！家の外はあぶない。')",
   "(\"Correct! Off your base, you're in danger.\", '正确！离开垒包就有危险。', '正解！塁の外はあぶない。')"),
  ("('Which fielder does NOT count as \"already passed\" if the ball goes by him?', '球经过哪位防守球员时，“不算”已经经过？', 'ボールが通りすぎても「もう通りすぎた」にならないのは、どの守備の選手？')",
   "('If the ball only went past this fielder, the exception does NOT apply. Who is it?', '如果球只是经过这位防守球员，例外就不算数。是谁？', 'ボールがこの選手のそばを通っただけなら、例外にならない。だれ？')"),
  ("'在这一级里，“安全”怎么说？', 'このレベルでは「安全」を何という？'",
   "'“安全上垒”的英语怎么说？', '「セーフ」は英語で何という？'"),
 ],
 8: [
  ("(\"That's it! E for errors.\", '对了！E 就是 errors。', 'そのとおり！Eは errors。')",
   "(\"That's it! E for errors.\", '对了！E 就是失误（errors）。', 'そのとおり！Eはエラー（errors）。')"),
  ("'q': (\"What's it called when a fielder messes up a normal play?\", '“失误”的英语怎么说？', 'エラーは英語で何という？'), 'o': [('Error', 'Error', 'Error'), ('Hit', 'Hit', 'Hit'),",
   "'q': ('What does the R on the scoreboard stand for?', '“得分”的英语怎么说？', '「得点」は英語で何という？'), 'o': [('Runs', 'Runs', 'Runs'), ('Strikes', 'Strikes', 'Strikes'),"),
  ("('Tap the player whose easy miss turns the batted ball into an error', '点一下因为漏接容易的球而造成失误的球员', 'かんたんなミスで打球をエラーにした選手をタッチしよう')",
   "('Tap the fielder who missed the easy play', '点一下漏掉容易的球的防守球员', 'かんたんなプレーをミスした守備の選手をタッチしよう')"),
 ],
 9: [
  ("('Correct! Back to your safe spot.', '正确！回到你安全的家。', '正解！安全なおうちへもどる。')",
   "('Correct! Back to your safe spot.', '正确！回到你的安全区。', '正解！安全地帯にもどる。')"),
  ("(\"With a lead, you're between two bases, off your safe spot.\", '离垒时你在两个垒之间，没有家。', 'リード中は、2つの塁のあいだ。おうちがない。')",
   "(\"With a lead, you're between two bases, off your safe spot.\", '离垒时你在两个垒之间，没有安全区。', 'リード中は、2つの塁のあいだ。安全地帯がない。')"),
  ("('The pitcher defends his base with that throw.', '投手用这种传球守住他的垒。', 'ピッチャーはその送球で塁を守るんだ。')",
   "('With that throw, the pitcher keeps the runner close.', '投手用这个传球盯住跑垒员。', 'ピッチャーはその送球でランナーを見はっているんだ。')"),
  ("('Good! Your base keeps you safe.', '很好！你安全的家救了你。', 'いいね！安全なおうちが君を守る。')",
   "('Good! Your base keeps you safe.', '很好！你的安全区救了你。', 'いいね！安全地帯が君を守る。')"),
  ("('Tagged off your base: out.', '在家外面被触到：出局。', 'おうちの外でタッチ：アウト。')",
   "('Tagged off your base: out.', '在垒外被触到：出局。', '塁の外でタッチ：アウト。')"),
  ("(\"True: with no runners, that move isn't punished that way.\", '这是对的：没有跑垒员时，这个动作不会这样处罚。', '正しいよ：ランナーがいなければ、その動きはこのばつにならない。')",
   "(\"True: with no runners, that move isn't called a balk.\", '这是对的：没有跑垒员时，这个动作不算投手犯规。', '正しいよ：ランナーがいなければ、その動きはボークにならない。')"),
  ("(\"True or false: if the throw beats you before you get there, you're out and there was no steal\", '对还是错：如果传球比你先到，你出局，盗垒不成功', '○か×か：着く前に送球にまけたらアウトで、盗塁にはならない')",
   "(\"True or false: if the throw gets there and you're tagged before you reach the base, you're out and there was no steal\", '对还是错：如果球先到、你在到垒前被触杀，你就出局，盗垒不成功', '○か×か：送球が来て、着く前にタッチされたらアウトで、盗塁にはならない')"),
  ("('What does the umpire call if the tag gets there before you?', '如果触杀比你先到，裁判怎么判？', 'タッチが君より先なら、審判のコールは？')",
   "(\"What does the umpire call if you're tagged with the ball before you get there?\", '如果你在到垒前被球触到，裁判怎么判？', '塁に着く前にボールでタッチされたら、審判のコールは？')"),
 ],
 10: [
  ("(\"Correct! Many small leagues don't use it.\", '正确！很多小联赛不用它。',",
   "(\"Correct! Many leagues for young kids don't use it.\", '正确！很多小朋友的联赛不用它。',"),
  ("('The runner stepped wrong and went right past second on his way. The defense appeals by touching:', '跑垒员踩错了，跑过二垒时没踩到。防守方申诉要触碰：',",
   "('The runner skipped second without touching it. The defense appeals by touching:', '跑垒员没踩二垒就跑过去了。防守方申诉要触碰：',"),
 ],
 11: [
  ("('The safe spot', '安全的家', '安全なおうち')", "('The safe spot', '安全区', '安全地帯')"),
 ],
 12: [
  ("('Correct! Receives and relays.', '正确！接球再转传。', '正解！受けて、つなぐ。')",
   "('Correct! Catch it and pass it on.', '正确！接住再传出去。', '正解！受けて、つなぐ。')"),
  ("(\"Receives the outfielder's throw and relays it to whatever base is needed\",",
   "(\"Catches the outfielder's throw and passes it on to whatever base is needed\","),
  ("('The infield relays for the outfield.', '内野为外野接力。', '内野が外野の送球をつなぐ。')",
   "('The infield helps the outfield with the throw.', '内野帮外野把球传到位。', '内野が外野の送球を手伝う。')"),
 ],
 14: [
  ("('Your body behind the ball stops it all.', '身体挡在球后面，什么都能挡住。', '体がボールのうしろにあれば、ぜんぶ止まる。')",
   "('With your body behind the ball, nothing gets by.', '身体挡在球后面，什么都跑不掉。', '体がボールのうしろにあれば、何もぬけない。')"),
 ],
 16: [
  ("('Wherever the batter feels famous', '击球员觉得自己最威风的地方', 'バッターが有名人みたいに思えるところ')",
   "('Outside the box, wherever he wants', '在击球员区外面，随便哪里', 'ボックスの外、どこでも')"),
 ],
 17: [
  ("('He moves his players like chess pieces.', '就像下棋的棋子一样。', 'チェスのコマみたいに。')",
   "('He moves his players like chess pieces.', '他像下棋一样移动自己的球员。', '選手をチェスのコマみたいに動かすんだ。')"),
  ("('True: the visitor always leaves a turn to answer.', '对：客队之后总还有主队回应的一局。', '正しい：ビジターのあとには、いつもホームの攻撃がある。')",
   "('True: the home team always gets its turn to answer.', '对：主队总会有回应的一局。', '正しい：ホームチームには、いつも反撃の攻撃がある。')"),
 ],
 18: [
  ("(\"Sliding helps you get in under the fielder's tag\", '滑垒能帮你躲到防守球员触杀的下面', 'スライディングは、守備のタッチの下をくぐるためのもの')",
   "(\"Sliding helps you get in under the fielder's glove\", '滑垒能帮你从防守球员的手套下面滑进垒', 'スライディングは、守備のグラブの下をくぐって塁に着くためのもの')"),
  ("('What your league requires, not a number from this game.', '是联赛的要求，不是这里的数字。', 'リーグが決めること。ここでの数字じゃない。')",
   "('Your league decides: ask your coach.', '由你的联赛决定：问问你的教练。', 'リーグが決めること。コーチに聞こう。')"),
  ("('This game, with a fixed number', '这份文件，用一个固定数字', 'この文書、決まった数字で')",
   "(\"A fixed number that's the same for every league\", '所有联赛都一样的固定数字', 'どのリーグも同じ、決まった数字')"),
  ("(\"It's banned in every league\", '这份文件规定所有联赛都禁止', 'この文書が全部のリーグで禁止している')",
   "(\"It's banned in every league\", '所有联赛都禁止', '全部のリーグで禁止されている')"),
 ],
 20: [
  ("'REVIEW: drag each idea to its call: through the zone with no swing / fourth bad one outside / knocked out of play', '复习：把每个情况拖到它的判定：穿过好球区没挥棒 / 第四个坏球在外面 / 打到界外', '復習：それぞれをコールにドラッグしよう：ゾーンを通ってふらない / 4つ目の悪い球が外 / 外へはじいた'",
   "'REVIEW: drag each idea to its call: through the zone with no swing / ball four, outside the zone / knocked out of play', '复习：把每个情况拖到它的判定：穿过好球区没挥棒 / 第四个坏球在好球带外 / 打到界外', '復習：それぞれをコールにドラッグしよう：ゾーンを通ってふらない / 4つ目のボールがゾーンの外 / 外へはじいた'"),
  ("'复习：点一下最后在一垒结束的经典双杀路线中的第一个垒', '復習：一塁で終わる、よくあるダブルプレーの道すじで、最初の塁をタッチしよう'",
   "'复习：点一下经典双杀中拿到第一个出局的垒', '復習：よくあるダブルプレーで、最初のアウトをとる塁をタッチしよう'"),
  ("('Good! That run is legal.', '很好！这样跑是合规的。', 'いいね！その走りはルールどおり。')",
   "('Good! Running to first there is legal.', '很好！那时跑向一垒是合规的。', 'いいね！そこで一塁へ走るのはルールどおり。')"),
  ("(\"The captain's C is earned with actions.\", '队长的“C”靠行动撑起来。', 'キャプテンの「C」は行動でささえる。')",
   "(\"The captain's C is earned with actions.\", '队长的“C”要靠行动赢得。', 'キャプテンの「C」は行動で手に入れるんだ。')"),
 ],
}
bad = []
for n, pairs in E.items():
    p = os.path.join(HERE, f'trans_l{n}.py')
    s = open(p).read()
    for old, new in pairs:
        if s.count(old) != 1:
            bad.append(f'L{n} ({s.count(old)}x): {old[:90]}')
            continue
        s = s.replace(old, new)
    open(p, 'w').write(s)
print('problemas:', bad or 'ninguno')
