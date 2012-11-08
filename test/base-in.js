var count = (function baseIn(BigNumber) {
    var start = +new Date(),
        log,
        error,
        undefined,
        passed = 0,
        total = 0;

    if (typeof window === 'undefined') {
        log = console.log;
        error = console.error;
    } else {
        log = function (str) { document.body.innerHTML += str.replace('\n', '<br>') };
        error = function (str) { document.body.innerHTML += '<div style="color: red">' +
          str.replace('\n', '<br>') + '</div>' };
    }

    if (!BigNumber && typeof require === 'function') BigNumber = require('../bignumber');

    function assert(expected, actual) {
        total++;
        if (expected !== actual) {
           error('\n Test number: ' + total + ' failed');
           error(' Expected: ' + expected);
           error(' Actual:   ' + actual);
           //process.exit();
        }
        else {
            passed++;
            //log('\n Expected and actual: ' + actual);
        }
    }

    function assertException(func, message) {
        var actual;
        total++;
        try {
            func();
        } catch (e) {
            actual = e;
        }
        if (actual && actual.name == 'BigNumber Error') {
            passed++;
            //log('\n Expected and actual: ' + actual);
        } else {
            error('\n Test number: ' + total + ' failed');
            error('\n Expected: ' + message + ' to raise a BigNumber Error.');
            error(' Actual:   ' + (actual || 'no exception'));
            //process.exit();
        }
    }

    function T(expected, value, base) {
        assert(expected, new BigNumber(value, base).toString())
    }

    log('\n Testing base-in...');

    BigNumber.config({
        DECIMAL_PLACES : 20,
        ROUNDING_MODE : 4,
        ERRORS : true,
        RANGE : 1E9,
        EXPONENTIAL_AT : 1E9
    });

    // Test integers of all bases against Number.toString(base).
    for (var i = 2; i < 37; i++) {
        for (var j = -100; j < 101; j++) {
            T(j.toString(), j.toString(i), i);
            var k = Math.floor(Math.random() * Math.pow(2, Math.floor(Math.random() * 52) + 1));
            T(k.toString(), k.toString(i), i);
        }
    }

    T('0', 0, 2);
    T('0', 0, 10);
    T('0', -0, 36);
    T('-5', -101, 2);
    T('-101', -101, 10);

    // TEST NUMBERS WITH FRACTION DIGITS.

    // Test rounding.
    BigNumber.config({DECIMAL_PLACES : 0, ROUNDING_MODE : 0});
    T('1', '0.1', 2);
    T('-1', '-0.1', 2);
    T('1000', '999.5', 10);
    T('-1000', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 1});
    T('0', '0.1', 2);
    T('0', '-0.1', 2);
    T('999', '999.5', 10);
    T('-999', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 2});
    T('1', '0.1', 2);
    T('0', '-0.1', 2);
    T('1000', '999.5', 10);
    T('-999', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 3});
    T('0', '0.1', 2);
    T('-1', '-0.1', 2);
    T('999', '999.5', 10);
    T('-1000', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 4});
    T('1', '0.1', 2);
    T('-1', '-0.1', 2);
    T('1000', '999.5', 10);
    T('-1000', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 5});
    T('0', '0.1', 2);
    T('0', '-0.1', 2);
    T('999', '999.5', 10);
    T('-999', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 6});
    T('0', '0.1', 2);
    T('0', '-0.1', 2);
    T('1000', '999.5', 10);
    T('-1000', '-999.5', 10);
    T('999', '999.4', 10);
    T('-999', '-999.4', 10);
    T('1000', '999.500001', 10);
    T('-1000', '-999.500001', 10);

    BigNumber.config({ROUNDING_MODE : 7});
    T('1', '0.1', 2);
    T('0', '-0.1', 2);
    T('1000', '999.5', 10);
    T('-999', '-999.5', 10);

    BigNumber.config({ROUNDING_MODE : 8});
    T('0', '0.1', 2);
    T('-1', '-0.1', 2);
    T('999', '999.5', 10);
    T('-1000', '-999.5', 10);

    BigNumber.config({DECIMAL_PLACES : 20, ROUNDING_MODE : 3});
    T('546141272243.39871532041499605905', '111111100101000100011100111100010110011.011001100001001000110101000011011001100010111000110000101011000010100010110111100010010000011010100100001111010010100', 2);
    T('-761392382117509615082995635394.835132598876953125', '-1001100111000011000100000100010111000100100100101110010100101000000110101101100101101101010011000010.110101011100101101000', 2);
    T('18181', '100011100000101.00', 2);
    T('-12.5', '-1100.10', 2);
    T('43058907596428432974475252.68192645050244227178', '10001110011110000101000000111011011100000010011100000001111011111011101110111111110100.10101110100100101011101101011011001011110111001101', 2);
    T('-50063197524405820261198.16624174237994681863', '-1010100110011110111001101110101001100100001000111000001111110000001101001110.001010101000111011010001100111101100000001111110011001111100001101111001', 2);
    T('12659149135078325508.50965366452082459802', '1010111110101110010101010001000100111011000010010111110100000100.100000100111100010101001100111010110011101001011100101110', 2);
    T('-6387062313767439324325.28595431079156696797', '-1010110100011111001001011101001100100001111011000110000100101010010100101.0100100100110100010011010011110100', 2);
    T('1396.09066858848154879524', '10101110100.0001011100110110000011100111111001001101100', 2);
    T('-13243297892469.48301514260489275543', '-11000000101101110010000100010000100001110101.0111101110100110111000010110000011110101111101100110', 2);
    T('343872.5', '1010011111101000000.10', 2);
    T('-27858197522682350277663998.90234375', '-1011100001011001100111110100111101101100011110100111111111001110111101001110011111110.111001110', 2);
    T('11350269087477005972403595905463622183936313327592261705214528.375', '11100010000001100111100001010001011000011110001001101101000011011111011100111010110101011100111001110110111111001001000111101000100100011110011011110011001011101010001100001001111010111110010101001000000.011', 2);
    T('-4582111067006609431937422134.8848765093534893822', '-11101100111000111011110000101010101111000001100010100011111001000111010110000001001100110110.11100010100001110100010001010100101011', 2);
    T('517236958880385002164572266126922644', '11000111001110111000000001111111110000110111101111101110011100111000000111101011000000001100011110010000101001110010100', 2);
    T('-21553306071707458208211095787817816237164981584743591.29723221556402690258', '-111001100110110101111011010110011000011000100110010000110101110110101011101011100001010010101000000110111100101000110100111001000111001101111100100110111001010100110010100111.01001100000101110110100100010101001010100100010100101', 2);

    BigNumber.config({DECIMAL_PLACES : 20, ROUNDING_MODE : 6});
    T('90182851032808914967166718343839124510737262515334936.05372908711433410645', '11110001000010011001110001010101001001001000011011110000101001011001110011010100000001001000011000010101101101000111110111101000001101000101100000101011100110000010111100011000.0000110111000001001100001', 2);
    T('-328.28125', '-101001000.010010', 2);
    T('606266547022938105478897519250152.63383591632958904971', '1110111100100001010001101110110111100101000011011110001111001011010010100111110100011000101110100101011101000.1010001001000011000100100001001110101010011100000110001', 2);
    T('-1236693955.36249679178679391345', '-1001001101101100111001111000011.010111001100110010010110111110011010000100010011010101010111111100000101001010101', 2);
    T('6881574.93937801730607199391', '11010010000000100100110.1111000001111011000100111110011011101001001100001101001011001010111', 2);
    T('-341919.144535064697265625', '-1010011011110011111.0010010100000000010', 2);
    T('97.10482025146484375', '1100001.000110101101010110000', 2);
    T('-120914.40625', '-11101100001010010.01101', 2);
    T('8080777260861123367657', '1101101100000111101001111111010001111010111011001010100101001001011101001', 2);
    T('-284229731050264281.85682739554010822758', '-1111110001110010010110111100111001110110110001011011011001.11011011010110010000101001001010001010010110', 2);
    T('1243984453515709828041525111137171813652.844970703125', '1110100111110111101011000011100001010011001110000000111100101100010010000100010000101010011101011011001000001111100011010100010100.110110000101', 2);
    T('-4208558618976524911747722597.24609066132409893216', '-11011001100100111100111100111110001011100111101001010011111110000111001100101110110101100101.00111110111111111100110000101110001111001110111010101110000111110100111001110011010001101111001101011000001011100101111011110000001101001111000', 2);
    T('1268683183361093666211101090.703125', '1000001100101101110000111010010111000000111000111110001110111001010100000111111100110100010.10110100', 2);
    T('-105641.26311671037711231997', '-11001110010101001.010000110101101110011101111000100001100111001110000111000011001001001000110101110001101111001101000000111000011100001001011101111100001011101010111101100010010001110111001110101010110001101110010011', 2);
    T('473340007892909227396827894000137.5', '1011101010110011001000000110110101100101110011110011001100111100110101100011010101000010000000010101000001001.1000', 2);
    T('-32746.47657717438337214735', '-111111111101010.011110100000000011110110001100011111111100100101111010110001110100001011010010001011101111001100110011001010010110001000111100011100', 2);
    T('192.49070453643798828125', '11000000.01111101100111101101000', 2);
    T('-1379984360196.47138547711438150145', '-10100000101001101011110100100001100000100.01111000101011001011011111111000000001', 2);

    BigNumber.config({DECIMAL_PLACES : 40, ROUNDING_MODE : 2});
    T('-729.0001524157902758725803993293705227861606', '-1000000.00000001', 3);
    T('-4096.0000152587890625', '-1000000.00000001', 4);
    T('-15625.00000256', '-1000000.00000001', 5);
    T('-46656.0000005953741807651272671848803536046334', '-1000000.00000001', 6);
    T('-117649.0000001734665255574303432156634721649541', '-1000000.00000001', 7);
    T('-262144.000000059604644775390625', '-1000000.00000001', 8);
    T('-531441.0000000232305731254187746379102835730507', '-1000000.00000001', 9);
    T('-1000000.00000001', '-1000000.00000001', 10);
    T('-1771561.0000000046650738020973341431092840981941', '-1000000.00000001', 11);
    T('-2985984.000000002325680393613778387440938881268', '-1000000.00000001', 12);
    T('-4826809.0000000012258947398402566721524761600832', '-1000000.00000001', 13);
    T('-7529536.0000000006776036154587122781861854381443', '-1000000.00000001', 14);
    T('-11390625.0000000003901844231062338058222831885383', '-1000000.00000001', 15);
    T('-16777216.00000000023283064365386962890625', '-1000000.00000001', 16);
    T('-24137569.0000000001433536083296850401481727781882', '-1000000.00000001', 17);
    T('-34012224.0000000000907444262711670884293370452072', '-1000000.00000001', 18);
    T('-47045881.0000000000588804597472215429921222500439', '-1000000.00000001', 19);
    T('-64000000.0000000000390625', '-1000000.00000001', 20);
    T('-85766121.0000000000264390375792455941496210138949', '-1000000.00000001', 21);
    T('-113379904.0000000000182229445394427114965206410085', '-1000000.00000001', 22);
    T('-148035889.0000000000127696005408659110598172017909', '-1000000.00000001', 23);
    T('-191102976.0000000000090846890375538218259411675049', '-1000000.00000001', 24);
    T('-244140625.0000000000065536', '-1000000.00000001', 25);
    T('-308915776.0000000000047886513275010026255956100003', '-1000000.00000001', 26);
    T('-387420489.0000000000035407061614721497695336509027', '-1000000.00000001', 27);
    T('-481890304.0000000000026468891228855948366647868677', '-1000000.00000001', 28);
    T('-594823321.000000000001999014833671504164315094574', '-1000000.00000001', 29);
    T('-729000000.0000000000015241579027587258039932937052', '-1000000.00000001', 30);
    T('-887503681.0000000000011724827159637921277158030113', '-1000000.00000001', 31);
    T('-1073741824.0000000000009094947017729282379150390625', '-1000000.00000001', 32);
    T('-1291467969.0000000000007110309102419347878538765581', '-1000000.00000001', 33);
    T('-1544804416.0000000000005599750325378321880787999147', '-1000000.00000001', 34);
    T('-1838265625.0000000000004440743054270216786320984887', '-1000000.00000001', 35);
    T('-2176782336.0000000000003544704151217464391770978328', '-1000000.00000001', 36);

    BigNumber.config({DECIMAL_PLACES : 51, ROUNDING_MODE : 4});
    T('1072424547177.982891327541533302850175278158817253467459228776101', 'donxvwix.zdts', 36);

    BigNumber.config({DECIMAL_PLACES : 86});
    T('824178538787196749922434027872451367594239056.93473392033316110609748881918323116875731371037529199959272159196515804304815690839727', '402kfhkd37bt5n8scr1ir9ndlrnipig.s17oe7rkhi91bh', 30);

    BigNumber.config({DECIMAL_PLACES : 84});
    T('9560389177469634483515162.499335215204179931606951906984830542647805834768203380512715304247460734647288652625', '195qdkkqsa8shmhp9e.edr89', 29);

    BigNumber.config({DECIMAL_PLACES : 65});
    T('5955289028666603391738616069969.70235175643053599414353772852590894151261634747374296179598348968', '8qp28dk3js2iqksmqaqnq.lntnif5qh', 31);

    BigNumber.config({DECIMAL_PLACES : 49});
    T('27603501710202437282037.4945845176631161140013607910579053986520224457133', '42545302442500101544532043113.254455200225412543300022520330204033', 6);

    BigNumber.config({DECIMAL_PLACES : 39});
    T('9464300204295306111422098057.77248824166891668678144149703717008528', '25473f3dbce5cf3hg8318d7.dg52d120b14ea966a7ag06a2gh03', 18);

    BigNumber.config({DECIMAL_PLACES : 15});
    T('133262758349237628352120716402.993431117739119', '3bkobquqthhfbndsmv3i.vp8o0sc4ldtji02mmgqr7blpdjgk', 32);

    BigNumber.config({DECIMAL_PLACES : 65});
    T('171510920999634527633.53051379043557196404057602235264411208736518600450525086556631034', '1fqecn4264r1is.ijur8yj41twl9', 35);

    BigNumber.config({DECIMAL_PLACES : 48});
    T('325927753012307620476767402981591827744994693483231017778102969592507', 'c16de7aa5bf90c3755ef4dea45e982b351b6e00cd25a82dcfe0646abb', 16);

    BigNumber.config({DECIMAL_PLACES : 48});
    T('72783.559378210242248003991012349918599484318629885897', '11c4f.8f33690f15e13146d99092446da', 16);

    BigNumber.config({DECIMAL_PLACES : 81});
    T('8535432796511493691316991730196733707212461.36382685871580896850891461623808', '9l0ah4mf8a0kcgn44oji4kh7l6fbenb.929jlggo43612jfn', 25);

    BigNumber.config({DECIMAL_PLACES : 7});
    T('0', '0', 2);
    T('3', '3', 24);
    T('0.037037', '0.1', 27);
    T('101412023101671912143604060399016691636944374947585694881897391246499475847835837224977373985157443438754012038820105175407623679155088073411120684342336808325631625647896282357928709212286943830565579566232670291284084535962556769836340401310575784301282705195128879424575312893.9', '999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999.99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991999999999999999999999999999999999999', 11);
    T('15398955012055570438.9425184', 'ST87ST87ST87S.S87TS87TS87TS', 30);
    T('2126934655697951.030303', '11111111111.1111111111111', 34);
    T('-288494149172542947905560340081675757349.9789739', '-P98IJYP96JHYP95DPHJWPH09Y.Y98HO8WH58HW', 35);

    BigNumber.config({DECIMAL_PLACES : 31});
    T('4060090888512781039564383580983002345701981946441239.3428571428571428571428571428571', '4hv6vl92gvkmumr0a6ley0dhkwmwfe35oo.c', 35);

    BigNumber.config({DECIMAL_PLACES : 90});
    T('20398136837.975941624007641435905199481124700109083958314345873245346912136478926756110974638825468924', '5MI4K5MF.MA66B0L4HK8DK35LI3D0G9JFF7LBB27LAKH3E4FCEJM', 23);

    BigNumber.config({DECIMAL_PLACES : 38});
    T('42689628837110945219.60963984922125154547359100149049425936', 'D37AFB2193DJ265.CGHI7F1BK1I9GJ', 21);

    BigNumber.config({DECIMAL_PLACES : 59});
    T('893835640746065892983175797034880314945754459977061255725623898879842611', '4231231434203102220114420330232412332321132204022241104411014023324140104333412232222433424401214430421', 5);

    BigNumber.config({DECIMAL_PLACES : 100});
    T('175', '67', 28);

    BigNumber.config({DECIMAL_PLACES : 59});
    T('683674717563732788139425742102304147', '23BXVQVK5NK29XCNPM7JWQQC', 35);

    BigNumber.config({DECIMAL_PLACES : 63});
    T('21872738004815869.777777777777777777777777777777777777777777777777777777777777778', 'E8NB0D88AN2D.IG', 24);

    BigNumber.config({DECIMAL_PLACES : 2});
    T('4839094569478687835499021764036676797809986482983355.46', '9G041CFCPN92FSECBIHHL1F1I74FJMGAKTR.EAJ7JQ', 31);

    BigNumber.config({DECIMAL_PLACES : 2});
    T('198496092814270915085258754228681831655498041942', '24310400201333231203024322334002413400114320223240014320424444320232', 5);

    BigNumber.config({DECIMAL_PLACES : 5});
    T('7371249.07083', '93089.23M993NGABNLEP', 30);

    BigNumber.config({DECIMAL_PLACES : 47});
    T('799580158552527670.51524163982781306375625835799992154433181428013', '1C5C994CD5A7E49A.7ADE19484CE921B8EE7', 15);

    BigNumber.config({DECIMAL_PLACES : 64});
    T('16165422251964685360633312857381850497426314130782805.0722805578590765752365085976081394656988159695365026477063128458', '184254BE3B14F86L7HPKEOIIJKHCQ3DDBCPG5.20IJJ', 28);

    BigNumber.config({DECIMAL_PLACES : 66});
    T('321903599394345741344181790866033344020400577177.313819548430693134687858394581066124770210878514089611637812764975', 'GKE2D93H4K55C41EA627I1867CEFFCHBHE8I.6C85JF7D0BFDJFK4K', 21);

    BigNumber.config({DECIMAL_PLACES : 38});
    T('66906978329149775053912152738679.85034153550858840284188803538614532877', '2011110022202010100200021000121022200222101110012102220102212010111.21122122002110012111112102002110221102120102', 3);

    BigNumber.config({DECIMAL_PLACES : 49});
    T('1334535467.5658391510074236740492770511046811319813437111801', '45033235646.365040260503443445435151335014', 7);

    BigNumber.config({DECIMAL_PLACES : 62});
    T('26234523211578269977959969', 'LMDG5KNKLAUCSCNH1.0', 32);

    BigNumber.config({DECIMAL_PLACES : 21});
    T('572315667420.390625', '10250053005734.31', 8);

    BigNumber.config({DECIMAL_PLACES : 0});
    T('135378457250661080667637636173904073793598540954140', '1002012000221022001212121111002202200112011211012200211202012002222102020101100001022121022011000222110010.012011121', 3);
    T('19121180169114878494408529193061279888621355', '30130433145052134410320001411315120554033203511455405455', 6);
    T('121756633', '1I0JBBC.F628AF202451951181911H3HGID95I855056I', 20);
    T('3943269', '7370130.225184', 9);
    T('491578', '1700072.2013436326', 8);
    T('7793119763346', '6A06CF7K7G.58CD39A32GE', 22);
    T('7529497809730458840', '4BI52A83H0F7720.6G912C3J4I6H7HI1I41', 20);
    T('46865454464741700656', 'BF6CDEA9FDBKKB.6G9A74QO718PHAK', 27);
    T('304', 'F4.18180D', 20);
    T('744', '453.61845741C18C5B7AC08A', 13);
    T('246', '77.MS', 34);
    T('191110529149', '2617704640174.75763527113244751520622', 8);
    T('6', '6.8E2FCGH', 18);
    T('11952558583', '49E4EDC8C.C86', 15);
    T('1486467157880871503427980640713668', 'C0776B7908614278DD33549496D36.539A196725', 14);
    T('13069', '5C43.B25BB7338', 13);
    T('811', 'R1.6', 30);
    T('1092443496', '1443DA51.G5FHF0121H2F', 19);
    T('995982886869648407459143', '1HJAHK0FKDN4LN29FI.3DDG4GCBBFJGOM648JBCCCBE5', 25);
    T('2563', '42D.9MBNBD3CHC961K4', 25);
    T('5165465768912078514086932864', '5165465768912078514086932864.15061794310893065985169641395', 10);
    T('5471', 'B6F.18F0HFAK', 22);
    T('10463269570005574', '2V0X3OKD7B9.VOFRSL', 36);
    T('303213556691515289188893743415846', '5AMIB6B7CEFJKJEL5H6CD1K5.H7996', 24);
    T('73885536580075722710224913630', '111011101011110010101110111100111100010011001101110011011001010001110110111100101100010011011101.1111100101011011100000101001010110110010001000000010100000111100001010100111110101', 2);
    T('72678037004728932464472011232185435761', '1J6F1EG58J959DDJ54HKBIHG6625B', 22);
    T('7', '111.01010000111000100001000010011011000100101010011111100110111011100011000000010110001010111000011000010110011101001010', 2);
    T('281006', '1000100100110101101.110001110000001100011001010100001110101111001100101111110011010100011110111010101000110000100010110010001011101010011000010000100001010100010100000000011010001011110101111110101101110100000000001', 2);
    T('8573576497511403672686', '1110100001100011001000110011111111011101101000100111100001101010001101101.11100010000011111000001110011100111', 2);
    T('40455365809845824222189300824558751', '1111100101010011010100000001111111110100101001001000000110111101001100011110001000011011101100010100100110010011110.10111100000011011111100110100101101111110001110100011100000000001111111001111100011011100011010', 2);
    T('46275491328393338072', '101000001000110011100100100010111101100011100011011101110011010111.10011001111111100010011010101101010001010001001000111100010101011101100011', 2);
    T('1433628110429482851535358742130957026457687710451052766168752', '11100100011000111101111111011100111100111011101101110010101011100111000110111010010011111010101010111010101011110111101010101000011010110011101111010011110011110111001010101001011010100000011010101111.10', 2);
    T('888', '1101111000.01110001001100110110011001000100101110001110101011110000100001101001000011010011111110111001001110100110001101011001011100101000000010010111111111111101101010110010101011010000101110000101100101100000101110011011000101110101', 2);
    T('1901556394517909524025875', '110010010101010111001010000100101110100000111100010000110000001011001001000010011.0010111010110101000001000001101010001100111101111100111010011011001000100000111010011011101110010000', 2);
    T('260195957172449000', '1110011100011001101101100000101111010000011010111011101000.000100000111110001011101010011011010100011100110111010101001010101000011110101100010100111100100110000110101', 2);
    T('654853', '10011111111000000101.000100010010100101001111011111101101010010001000100110110101110110010111010110000110010001001101010010110010110100101011100011101001110111000111000010001001100', 2);
    T('186', '10111001.11001111010', 2);
    T('45580573', '10101101111000000100011100.1010101100100100101110001110001111101010110011101110001000000100111011011101011011', 2);
    T('74504933', '100011100001101101011100100.1110010001101110101110100000110010010100000111101100100011011001011011111', 2);
    T('2', '10.001010111110111010100000011010000001011010110111001010001110100110111001100100001000011110101100101', 2);
    T('10653067', '101000101000110110001011.0001110000101000100000101011010100000001011100001111110001101001110110111011010000011011000000100011', 2);
    T('3103819016502701158728118887794', '100111001011001111101011101010010100101011001111011000001000110100100001001011110010001110010101110001.111111100111100100100111001000101011110011110011000000000001101010111101100010100010100001100000101110100111010000010011001', 2);
    T('70726621184417493343184041374', '111001001000011110110000100110010000100100000101010100001010011100110000100100110011010110011110.0101000011101101100111001110000111010111010111101101101100000101011010001011010111010', 2);
    T('4639750624206524979284798532410213523141234414', '11010000000011011011100110011110101101001101111100011101110100111010111000110000010010000001101010101110011101110011101101000111011101010000111011101101.11111111000111101101010110010011', 2);
    T('2377749182359', '100010100110011100111001010011011110010110.11010', 2);
    T('26', '11001.100111001011111001010011010101011000110110111100011100101101101111000001101001000011101', 2);
    T('389501027984', '101101010110000000100100000011010010000.01010001000000010100011101101100001111011001', 2);
    T('5169', '1010000110001.0010001010100001011111010000111010001110110111011111110001010000100100010110000110111001110101100011110100110100111001011100100111101000100011110001011011000011011000100001100000000100001010010001010110001010010010101011', 2);
    T('2072974714841016', '111010111010101110000001001100000011010011110110111.10011111010001011000011011010001100', 2);
    T('3', '10.11', 2);
    T('6569814675686107322725113', '10101101111001101100101111000000001011111101000101100011110001110110011001011111001.00100011110010001110011001100001000011000010100101011100101000100101111011011101000001110100101001001001100010100001001100011010011011', 2);
    T('984456092178345483540429', '11010000011101110111100011000000110111000100100101100011101001111001011111001100.10110000010110000110100110110001100010111001', 2);
    T('6729551587237203748588625739672573822682543614592964521541035860', '100000101101111001111011010110111111110111000100001010001101001110111111101100011101010001101011100011010110010100001100111110101010111110001111100010000111000010100001010011000111100000000000101001110011101010100', 2);
    T('329347347', '10011101000010111000100010011.0001101000000100000000011101110101011001000011111100110110000100100011110001110110010011001000011010001100010010000101010001111000110', 2);

    /*
    BigNumber.config({DECIMAL_PLACES : 5000});
    T('6022239845523628300792137851333617197616053606580805361460444571405159915948416057193556599026984420186847535714193186506779546.45562364433149048376909884425264838196627845956471301832353037216028002220557941081995561235866533298815815922678466806108234749212464649692584770778636508682771855319769124974649405509297732509500507702362168384314107653609786430967640203107454687605887412794096157913528626853706056446855881531545195000734665133919578058463901659136523244159808597378906266443321758454939816465192126295342280568880123960605134416002321981988529228618898697072789772080291342478304351440847738944612720456898241717924298967008171252854355869450188166408302699162551054528159131912895298938197347616702659802404073209181609536327921587288300421033874114565425368107966522446454855931005917304136935908432754883056828263061549088965135169569684456008477541982066123091033968877584432281431379815341125413388350665252537980749041131051878291040173564632382596634048981529497244126378198699352829834835751033446902713765443032376617851981166182096456938914400530557912226087362980440980578460246231055456778104006415527727260144095903127275419414807349147304707405254543427544838982731455334927521421806120799785694323203756123916853431908716090161389876298981034132804663437564753354768639621168658600102486177710685317251506858936381061516323456154147708084807303368146788089168077930658523442473995088742325773226839695051398002486616767897842485900547744342133455226785895506239035265653618936400640974168752824304125514038750444312714907633618171991355429431759439952307076477817217105979944570733869770158307019913889590797598165139754807215433076623400151503800862360578168290788982250598565524133502841168163050960633073023086590377971028607254136702588526777419958903274032568187324150715013909702207304519885442684246154424782763896029535730853643906929626045280406345718447643848365642454794436200184559384104514455046474916698853542487141393373504315472859932883938412782930021292976807483126232761531618262529099148770786402625394165285080740814372385937680961636708062338551092904431743317072664203085901678724391714803254679215220462002284827189814215842974479924985602985736840346662287388320297983891277984351215430795679480190118537345626368022990139894769505155754558312126932952671414774316202379066527423168541384888466209214314154656662254580694814197800298638656821314275995533216305058772309199532434503635943016121377240397454883296750491850460737680808149474215115525147893924328495593024234124241923099439564731922184295950348564035465169266840591302330909689592731054406376096204521212856678638595326253266853596009793769540552472576546585623610514603873467842223218383413469519311698301974531524237384072650293621563877939654382136609518592602998975525783497411981332278754077646791148254910680215716571959847794999990247155904843380251881145330210230503708687521912940355094829433297671479621259952291050451507069861516277689852652120824074226408244695466776128994445706937283501626742574832399257358784925070613374733443923318045672485243752481960132066316477982467772782652564401225093039509921674057244503251628994886108332809253787838807087045292349084813153418737514141651084390353861740493248726168058140952618277156388955744920898401233144729995305891815236381631092752549773465825925187270747564816278320933350674627641648384663562427197990911234109442852754919229966716090476391048342193483833862003532792898637819146892137188859066257902207068814887904172213161571698554092509870791904603500154815868135120390375352892915790562057269104998986616170310087063962096170912045311169499205938470776723319613174250097225084425676690856982407000880056724620818824503061125725461684399498255127313452269964097609152404362732856503883361007911375417900940044634592803539714125533402906835228146503351037643506565226937040944039386627046902360157120659188931448110133381205133170527455488802527077001776856346493147507947490287029277744578775527372923256995419864299678429507426389922953403127483507515479327442988251888961453922972301510643563216583092771781978061366034284974632235631032912241967179283080214267387399797724014498036440569206078211810225217786455419707373248180986740603131905953623973926533609693886155905704306604100315482559358455550018630679789876126218887092040393676456180793809957296390894821682732929521075917502388856575712596709103037671223414578669707747332478371632108168893761388532592606235363056704156483680099201459584177626289636906715420355110405019316492710052426228518585155223882424429151702414484321844004913577523588611847871639322325737509992577988369672218344719659244872142799432036756062631109614278597717292745716623038732618863518899700937188424653264323754203446589769545236970901181775744966400800101730416875793459251675109469665985644198416152029852905095989068691042302222376893958470550095432860142880876451168971479312433163514921818509750264250472945722655641064950528004153004188190549429918759335822341644887168398385954219498973215722761336436971169084930492144143419812959401754073906781284401436962270645729138821367459312144327', '58LURTSHGLIURSHG8O7YH8OG754YOG8O7YGYG75EOY5EYGO87EYOG87YG407Y87Y1IUHJROLIGKHGERGRE.GEHKRGUERYG0908Y76981YIUGHFIJVRBKOFUHEWO8T9343097', 36);
    */

    BigNumber.config({DECIMAL_PLACES : 20});

    assertException(function () {new BigNumber('2', 0).toString()}, "('2', 0)");
    assertException(function () {new BigNumber('2', 2).toString()}, "('2', 2)");
    assertException(function () {new BigNumber('2', '-2').toString()}, "('2', '-2')");
    assertException(function () {new BigNumber('0.000g', 16).toString()}, "('0.000g', 16)");
    assertException(function () {new BigNumber('453.43', 4).toString()}, "('453.43', 4)");
    assertException(function () {new BigNumber('1', 1).toString()}, "('1', 1)");
    assertException(function () {new BigNumber('1.23', 36.01).toString()}, "('1.23', 36.01)");
    assertException(function () {new BigNumber('1.23', 37).toString()}, "('1.23', 37)");

    assertException(function () {new BigNumber(12.345, NaN).toString()}, "(12.345, NaN)");
    assertException(function () {new BigNumber(12.345, 'NaN').toString()}, "(12.345, 'NaN')");
    assertException(function () {new BigNumber(12.345, []).toString()}, "(12.345, [])");
    assertException(function () {new BigNumber(12.345, {}).toString()}, "(12.345, {})");
    assertException(function () {new BigNumber(12.345, '').toString()}, "(12.345, '')");
    assertException(function () {new BigNumber(12.345, ' ').toString()}, "(12.345, ' ')");
    assertException(function () {new BigNumber(12.345, 'hello').toString()}, "(12.345, 'hello')");
    assertException(function () {new BigNumber(12.345, '\t').toString()}, "(12.345, '\t')");
    assertException(function () {new BigNumber(12.345, new Date).toString()}, "(12.345, new Date)");
    assertException(function () {new BigNumber(12.345, new RegExp).toString()}, "(12.345, new RegExp)");
    assertException(function () {new BigNumber(101, 2.02).toString()}, "(101, 2.02)");
    assertException(function () {new BigNumber(12.345, 10.5).toString()}, "(12.345, 10.5)");

    T('NaN', 'NaN', undefined);
    T('NaN', 'NaN', null);
    T('NaN', NaN, 2);
    T('NaN', '-NaN', 2);
    T('NaN', -NaN, 10);
    T('NaN', 'NaN', 10);
    T('12.345', 12.345, new BigNumber(10));
    T('12.345', 12.345, null);
    T('12.345', 12.345, '1e1');
    T('12.345', 12.345, undefined);
    T('Infinity', 'Infinity', 2);
    T('Infinity', 'Infinity', 10);
    T('-Infinity', '-Infinity', 2);
    T('-Infinity', '-Infinity', 10);
    T('101725686101180', '101725686101180', undefined);
    T('101725686101180', '101725686101180', 10);

    BigNumber.config({ERRORS : false});

    T('2', '2', 0);
    T('NaN', '2', 2);
    T('2', '2', '-2');
    T('NaN', '0.000g', 16);
    T('NaN', '453.43', 4);
    T('1', '1', 1);
    T('1.23', '1.23', 36.01);
    T('1.23', '1.23', 37);

    T('NaN', 'NaN', 'NaN');
    T('NaN', 'NaN', undefined);
    T('NaN', 'NaN', null);
    T('NaN', NaN, 2);
    T('NaN', '-NaN', 2);
    T('NaN', -NaN, 10);
    T('NaN', 'NaN', 10);
    T('12.345', 12.345, new BigNumber(10));
    T('12.345', 12.345, null);
    T('12.345', 12.345, undefined);
    T('12.345', 12.345, NaN);
    T('12.345', 12.345, 'NaN');
    T('12.345', 12.345, []);
    T('12.345', 12.345, {});
    T('12.345', 12.345, '');
    T('12.345', 12.345, ' ');
    T('12.345', 12.345, 'hello');
    T('12.345', 12.345, '\t');
    T('12.345', 12.345, new Date);
    T('12.345', 12.345, new RegExp);
    T('5', 101, 2.02);
    T('12.345', 12.345, 10.5);
    T('12.345', 12.345, '1e1');
    T('Infinity', 'Infinity', 2);
    T('Infinity', Infinity, 10);
    T('-Infinity', -Infinity, 2);
    T('-Infinity', '-Infinity', 10);
    T('101725686101180', '101725686101180', undefined);
    T('101725686101180', '101725686101180', 10);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];;
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;