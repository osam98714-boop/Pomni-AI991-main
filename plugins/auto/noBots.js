export default async function before(m, { conn, bot }) {
    const groups = [
        "@g.us"
    ]; /* حط الجروبات الي عايز البوتات الفرعي متشتغلش فيها */

    if (bot.isSubBot && groups.includes(m.chat)) {
        return true;
    }

    return false;
}