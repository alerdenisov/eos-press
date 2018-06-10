#include <eosiolib/eosio.hpp>
#include <eosiolib/action.hpp>
#include <eosiolib/crypto.h>
#include <eosiolib/print.hpp>
#include <string>
#include "contentFeed.hpp"

using std::string;
using namespace eosio;

constexpr char hexmap[] = {'0', '1', '2', '3', '4', '5', '6', '7',
                           '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

std::string hexStr(const char *data, int len)
{
  std::string s(len * 2, ' ');
  for (int i = 0; i < len; ++i)
  {
    s[2 * i] = hexmap[(data[i] & 0xF0) >> 4];
    s[2 * i + 1] = hexmap[data[i] & 0x0F];
  }
  return s;
}

class contentFeed : public eosio::contract
{
public:
  //@abi table contentnode i64
  struct content_node
  {
    uint64_t hash;
    uint64_t previousHash;
    account_name creator;
    string content;
    // TODO: implement better way to store and get it
    signature signature;

    uint64_t primary_key() const { return hash; }
    uint64_t by_previous() const { return previousHash; }
    uint64_t by_creator() const { return creator; }

    EOSLIB_SERIALIZE(content_node, (hash)(previousHash)(creator)(content)(signature))
  };

  explicit contentFeed(action_name self) : contract(self) {}
  /// @abi action
  void add(const name feed,
           const account_name creator,
           const uint64_t previous,
           const string &content,
           const signature &sig)
  {
    require_auth(creator);

    checksum256 contentHash;
    char contentBuffer[content.size()];
    content.copy(contentBuffer, content.size(), 0);
    contentBuffer[content.size()] = '\0';
    sha256(contentBuffer, content.size(), &contentHash);

    eosio::multi_index<N(contentnode), content_node> selectedFeed(_self, feed);

    auto foundContent = selectedFeed.find(contentHash.hash[0]);

    eosio_assert(foundContent == selectedFeed.end(), "Same content already exists");

    print((string("Hash is ") + hexStr((const char *)&contentHash.hash[0], 32)).c_str());

    public_key pk;
    recover_key(&contentHash, (const char *)&sig, sizeof(sig), pk.data, sizeof(pk));

    print((string("Pub is ") + hexStr((const char *)&pk.data, 34)).c_str());
    // TODO: how to compare pk with account?

    selectedFeed.emplace(creator, [&](auto &node) {
      node.hash = contentHash.hash[0];
      node.previousHash = previous;
      node.creator = creator;
      node.content = content;
      node.signature = sig;
    });
  }

private:
  typedef eosio::multi_index<
      N(contentnode), content_node>
      // eosio::indexed_by<N(previous), eosio::const_mem_fun<content_node, uint64_t, &content_node::by_previous>>,
      // eosio::indexed_by<N(creator), eosio::const_mem_fun<content_node, account_name, &content_node::by_creator>>>
      content_index;
};

EOSIO_ABI(contentFeed, (add))
