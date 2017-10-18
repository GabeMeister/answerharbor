function incrementID(prevID, prefix) {
    var num = prevID.replace(prefix, '');
    return prefix + _.toString(_.toInteger(num) + 1);
}
