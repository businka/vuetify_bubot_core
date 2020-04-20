describe("pow", function() {
   var test_xml = '<array><object><str name="Идентификатор">005056b7-7242-1ee8-acd2-62a8a5312323</str><str name="Дата">07.08.2018</str><str name="Сумма">0.00</str><object name="НашаОрганизация"><object name="СвЮЛ"/></object><object name="Контрагент"><object name="СвЮЛ"><str name="Название">СБИСПартнер</str></object></object><array name="Событие"/><object name="Состояние"><str name="Название">Отправлен</str></object><array name="Этап"/><array name="ДокументОснование"/><array name="Редакция"/><array name="Вложение"><object><object name="Файл"/><array name="Редакция"/><array name="Подпись"/></object><object><object name="Файл"/><array name="Редакция"/><array name="Подпись"/></object></array></object><object><str name="Идентификатор">005056b7-7242-1ee8-a6c2-f9cebde8e323</str><str name="Дата">07.08.2018</str><str name="Сумма">0.00</str><object name="НашаОрганизация"><object name="СвЮЛ"/></object><object name="Контрагент"><object name="СвЮЛ"><str name="Название">СБИСПартнер</str></object></object><array name="Событие"/><object name="Состояние"><str name="Название">Отправлен</str></object><array name="Этап"/><array name="ДокументОснование"/><array name="Редакция"/><array name="Вложение"><object><object name="Файл"/><array name="Редакция"/><array name="Подпись"/></object><object><object name="Файл"/><array name="Редакция"/><array name="Подпись"/></object></array></object></array>',
       test_obj = [{'Идентификатор': '005056b7-7242-1ee8-acd2-62a8a5312323', 'Дата': '07.08.2018', 'Сумма': '0.00', 'НашаОрганизация': {'СвЮЛ': {}}, 'Контрагент': {'СвЮЛ': {'Название': 'СБИСПартнер'}}, 'Событие': [], 'Состояние': {'Название': 'Отправлен'}, 'Этап': [], 'ДокументОснование': [], 'Редакция': [], 'Вложение': [{'Файл': {}, 'Редакция': [], 'Подпись': []}, {'Файл': {}, 'Редакция': [], 'Подпись': []}]}, {'Идентификатор': '005056b7-7242-1ee8-a6c2-f9cebde8e323', 'Дата': '07.08.2018', 'Сумма': '0.00', 'НашаОрганизация': {'СвЮЛ': {}}, 'Контрагент': {'СвЮЛ': {'Название': 'СБИСПартнер'}}, 'Событие': [], 'Состояние': {'Название': 'Отправлен'}, 'Этап': [], 'ДокументОснование': [], 'Редакция': [], 'Вложение': [{'Файл': {}, 'Редакция': [], 'Подпись': []}, {'Файл': {}, 'Редакция': [], 'Подпись': []}]}];
  it("decode", function() {
    var result = xml.decode(test_xml);
    assert.isArray(result);
    assert.equal(result.length, 2);
    assert.sameDeepMembers(result, test_obj);
  });
  it("encode", function() {
    var result = xml.encode(test_obj);
    assert.isArray(result);
    assert.equal(test_obj, test_xml);
  });
});