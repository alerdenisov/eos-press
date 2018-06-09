#include <eosiolib/eosio.hpp>
#include <eosiolib/crypto.h>
#include <eosiolib/print.hpp>
#include <string>
#include "contentFeed.hpp"

using std::string;
using namespace eosio;

class contentFeed : public eosio::contract
{
public:
  explicit contentFeed(action_name self) : contract(self) {}
  /// @abi action
  void add(const account_name creator,
           const uint64_t previous,
           const string &content,
           const string &signature)
  {
    require_auth(creator);
    // // TODO: Multi site\feed index?
    // content_index contentFeed(_self, _self);

    // checksum256 contentHash;
    // sha256((char *)&content, content.size(), &contentHash);

    // eosio::print("Hash is ", (const char *)&contentHash.hash[0]);

    eosio::print("Hash is ", name{creator});
  }

private:
  //@abi table address i64
  struct contentNode
  {
    uint64_t previousHash;
    uint64_t hash;
    account_name creator;
    string content;
    // TODO: implement better way to store and get it
    string signature;

    uint64_t primary_key() const { return hash; }
    uint64_t by_previous() const { return previousHash; }
    uint64_t by_creator() const { return creator; }

    EOSLIB_SERIALIZE(contentNode, (previousHash)(hash)(creator)(content))
  };

  typedef eosio::multi_index<
      N(contentNode), contentNode,
      eosio::indexed_by<N(previous), eosio::const_mem_fun<contentNode, uint64_t, &contentNode::by_previous>>,
      eosio::indexed_by<N(creator), eosio::const_mem_fun<contentNode, account_name, &contentNode::by_creator>>>
      content_index;
};

EOSIO_ABI(contentFeed, (add))
